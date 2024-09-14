interface CarouselItemProps{
    folder: string,
    alt: string,
    dateToFrom: string,
    className?: string,
    href: string,
    desc:string| JSX.Element,
    title:string
}

interface Acheivement {
    title: string,
    desc: string| JSX.Element,
    dateToFrom: string,
    href: string,
    image: string,
    importance: number
}

interface Skill {
    name: string,
    years: number,
    level: string,
    image: string
}

interface Contact { 
    icon: string,
    href: string,
    method: string
}

interface Writeup {
    title: string,
    desc: string| JSX.Element,
    image: string,
    datePosted: Date
    competition: string
    category: string
    difficulty: "Easy" | "Medium" | "Hard",
    writeupFile: string
    solves: number | null
    sourceCode: string | null
    points: number | null
    hints?: Array<string>
    id: number
    [key: string]: any
}

interface Option {
    value: string;
    label: string;
  }

  
export type {CarouselItemProps, Acheivement, Skill, Contact, Writeup, Option}