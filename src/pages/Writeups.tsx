import React, {useState, useMemo, useEffect} from "react";
import writeupDetails from "../data/writeupDetails";
import WriteupItem from "../components/WriteupItem";
import SearchBar from "../components/SearchBar";
import {Dropdown, DropdownProvider} from "../components/DropDown";
import { Option } from "../misc/types";
import Heading from "../components/Heading";
const competitionNames = new Set(writeupDetails.map((writeup) => writeup.competition));
const difficulties = new Set(["Easy","Medium","Hard"]);
const categories = new Set(["Web"])
const Writeups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [competitionFilter, setCompetitionFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const initializeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    const competitionParam = urlParams.get("competition");
    const difficultyParam = urlParams.get("difficulty");
    const categoryParam = urlParams.get("category");

    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (competitionParam && competitionNames.has(competitionParam)) {
      setCompetitionFilter(competitionParam);
    }
    if (difficultyParam && difficulties.has(difficultyParam)) {
      setDifficultyFilter(difficultyParam);
    }
    if (categoryParam && categories.has(categoryParam)) {
      setCategoryFilter(categoryParam);
    }
  };

  // Use useEffect to initialize the state on component mount
  useEffect(() => {
    initializeFromURL();
  }, []);
  
  const updateSearchParams = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("search", searchQuery);
    newUrl.searchParams.set("competition", competitionFilter);
    newUrl.searchParams.set("difficulty", difficultyFilter);
    newUrl.searchParams.set("category", categoryFilter);
    window.history.replaceState({}, "", newUrl.toString());
  }
  const handleCompetitionFilter = (competition: Option) => {
    setCompetitionFilter(competition.value);
  }
  const handleDifficultyFilter = (difficulty: Option) => {
    setDifficultyFilter(difficulty.value);
  }
  const handleCategoryFilter = (category: Option) => {
    setCategoryFilter(category.value);
  }
  const handleSearchQuery = (search: string) => {
    setSearchQuery(search);
  }
  useEffect(() => {
    updateSearchParams();
  }, [searchQuery, competitionFilter, difficultyFilter, categoryFilter])
  const filteredWriteups = useMemo(() => {
    return writeupDetails.filter((writeup) => {
      const searchCategories = [
        "title",
        "desc",
        "competition"
      ]
      for (const category of searchCategories) {
        if (writeup[category].toLowerCase().includes(searchQuery.toLowerCase())
        && (competitionFilter === "All" || writeup.competition === competitionFilter)
      && (categoryFilter === "All" || writeup.category === categoryFilter)
      && (difficultyFilter === "All" || writeup.difficulty === difficultyFilter)
      ) {
          return true;
        }
      }
      return false;
    })
  },[searchQuery, competitionFilter, difficultyFilter, categoryFilter])
    return <>

        <Heading className="my-4 mt-12">Writeups</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-11/12 md:w-8/12 mx-auto gap-x-2 gap-y-4">
          <SearchBar className = "col-span-2 sm:col-span-3" searchQuery={searchQuery} onChange={handleSearchQuery}/>
          <DropdownProvider>
            <Dropdown 
            index = {0}
            className = "col-span-1" 
            value={competitionFilter}
            options={[{label:"Competition", value:"All"},...Array.from(competitionNames).map((competition) => ({label:competition, value:competition}))]} 
            placeholder="Competition" onSelect={handleCompetitionFilter}/>
            <Dropdown 
            index = {1}
            value={difficultyFilter}
            className = "col-span-1" options={[{label:"Difficulty", value:"All"},...Array.from(difficulties).map((difficulty) => ({label:difficulty, value:difficulty}))]}
            placeholder="Difficulty" onSelect={handleDifficultyFilter}/>
            <Dropdown 
            index = {2}
            value={categoryFilter}
            className = "col-span-2 sm:col-span-1" options={[{label:"Category", value:"All"},...Array.from(categories).map((category) => ({label:category, value:category}))]}
            placeholder="Category" onSelect={handleCategoryFilter}/>
          </DropdownProvider>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-8 my-4 box-border gap-4">
          {
            filteredWriteups.map((writeup, idx) => {
              return (
                <WriteupItem writeupDetails={writeup} key={writeup['id']}/>
              )
            })
          }
        </div>
      </>
}

export default Writeups