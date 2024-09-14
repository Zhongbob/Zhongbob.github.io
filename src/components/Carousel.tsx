import React, { useState, useEffect, useRef } from "react";
import CarouselItem from "./CarouselItem";
import { CarouselItemProps } from '../misc/types';

const Carousel: React.FC<{ items: CarouselItemProps[], curIndex:any, setCurrentIndex:any}> = ({ items, curIndex, setCurrentIndex }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeout = useRef<number | undefined>(undefined);
  const startPos = useRef(0);
  const isDragging = useRef(false);
  // Function to check the centered item
  const checkCenteredItem = (): number => {
    if (!carouselRef.current) return 0;

    const carouselRect = carouselRef.current.getBoundingClientRect();
    const viewportCenter = carouselRect.left + carouselRect.width / 2;
    const carouselRectWidth = carouselRect.width;
    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - viewportCenter);
        const distAsPercentage = distance / carouselRectWidth;
        item.style.transform = `scale(${1 - distAsPercentage * 0.5})`;
        item.style.opacity = `${1 - distAsPercentage * 0.8}`;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });
    setCurrentIndex(closestIndex);
    return closestIndex;
  };

  // Handle the end of scroll (after a user stops scrolling)
  const handleScrollEnd = (curIndex: number) => {
    if (isDragging.current) return; // Do nothing if the user is dragging

    const curItem = itemRefs.current[curIndex];
    if (curItem && carouselRef.current) {
      carouselRef.current.scrollTo({
        left:
          curItem.offsetLeft -
          (carouselRef.current.offsetWidth || 0) / 2 +
          curItem.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };
  
  const handleScrollWheel = (event: any) => {
    if (carouselRef.current) {
      if (carouselRef.current.scrollLeft <= 100 && event.deltaY < 0) {
        return;
      }
      if (
        carouselRef.current.scrollLeft >=
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth - 100&&
        event.deltaY > 0
      ) {
        return;
      }
      carouselRef.current.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }
  // Handle the scroll event
  const handleScroll = () => {
    const curIndex = checkCenteredItem();

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set a new timeout to detect when scrolling has stopped
    scrollTimeout.current = window.setTimeout(() => {
      handleScrollEnd(curIndex); // Trigger the auto-centering
    }, 100); // Wait 100ms after scroll stops
  };

  // Track whether the user is actively dragging the scrollbar
  const handleMouseDown = (event: any) => {
    startPos.current = event.clientX;
    isDragging.current = true; // User starts dragging
  };
  const handleMouseMove = (event: any) => {
    if (!isDragging.current) return; // Do nothing if user is not dragging
    // move the carousel
    if (carouselRef.current) {
      const diff = startPos.current - event.clientX;
      startPos.current = event.clientX;
      carouselRef.current.scrollLeft += diff;
    }
    const curIndex = checkCenteredItem(); // Recheck centered item while user is dragging
    
  }
  const handleMouseUp = () => {
    isDragging.current = false; // User stops dragging
    const curIndex = checkCenteredItem(); // Recheck centered item when user releases
    handleScrollEnd(curIndex); // Trigger auto-centering after user releases scrollbar
  };

  // Set up scroll and mouse event listeners
  useEffect(() => {
    const ref = carouselRef.current;
    checkCenteredItem();
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      ref.addEventListener("mousedown", handleMouseDown);
      ref.addEventListener("wheel", handleScrollWheel);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
        ref.removeEventListener("mousedown", handleMouseDown);
        ref.removeEventListener("wheel", handleScrollWheel);
        
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <div ref={carouselRef} className="
        relative w-11/12 h-72 lg:h-96 flex my-8 lg:px-[25rem] mx-auto overflow-x-auto overflow-y-hidden gap-4 py-8 box-border">
      {items.map((item, index) => (
        <CarouselItem
          key={index}
          folder={item.folder}
          alt={item.alt}
          dateToFrom={item.dateToFrom}
          className={item.className}
          href={item.href}
          desc={item.desc}
          title={item.title}
          ref={(el) => (itemRefs.current[index] = el)} />
      ))}
    </div>
  );
}

export default Carousel