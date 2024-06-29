import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from ".";
import {
  fetchItems,
  setCurrentPageData,
  setNextPageData,
  setPrevPageData,
  setCurDisplayedPage,
} from "../app/recipesSlice";
import {
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

const PaginationButtons = () => {
  const dispatch = useDispatch();
  const itemsDisplayedPerPage = useSelector(
    (state) => state.recipes.itemsDisplayedPerPage,
  );
  const nextPageData = useSelector((state) => state.recipes.nextPageData);
  const prevPageData = useSelector((state) => state.recipes.prevPageData);
  const curPageData = useSelector((state) => state.recipes.curPageData);
  const curDisplayedPage = useSelector(
    (state) => state.recipes.curDisplayedPage,
  );
  const totalPagesToDisplay = useSelector(
    (state) => state.recipes.totalPagesToDisplay,
  );

  const prevDisable = curDisplayedPage <= 1;
  const nextDisable = curDisplayedPage >= totalPagesToDisplay;

  const gotoPrevPage = () => {
    if (!prevDisable) {
      if (prevPageData.length > 0) {
        dispatch(setNextPageData(curPageData));
        dispatch(setCurrentPageData(prevPageData));
        dispatch(setPrevPageData([]));
        dispatch(setCurDisplayedPage(curDisplayedPage - 1));
      } else {
        gotoPageNum(curDisplayedPage - 1);
      }
      window.scrollTo(0, 0); // Scroll to top
      // react router scroll restoration doesn't work since url isn't changing
    }
  };

  const gotoNextPage = () => {
    if (!nextDisable) {
      if (nextPageData.length > 0) {
        dispatch(setPrevPageData(curPageData));
        dispatch(setCurrentPageData(nextPageData));
        dispatch(setNextPageData([]));
        dispatch(setCurDisplayedPage(curDisplayedPage + 1));
      } else {
        gotoPageNum(curDisplayedPage + 1);
      }
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  const gotoPageNum = async (pageNum) => {
    if (pageNum === curDisplayedPage + 1 && nextPageData.length > 0) {
      // user want to goto next page
      gotoNextPage();
    } else if (pageNum === curDisplayedPage - 1 && prevPageData.length > 0) {
      // user want to goto previous page
      gotoPrevPage();
    } else if (pageNum !== curDisplayedPage) {
      const pageToFetch = Math.ceil(pageNum / 2);
      const { recipes } = await dispatch(
        fetchItems({ pageNum: pageToFetch, limit: itemsDisplayedPerPage * 2 }),
      ).unwrap();

      dispatch(setCurDisplayedPage(pageNum));
      if (pageNum % 2 === 0) {
        dispatch(setCurrentPageData(recipes.slice(itemsDisplayedPerPage)));
        dispatch(setPrevPageData(recipes.slice(0, itemsDisplayedPerPage)));
        dispatch(setNextPageData([]));
      } else {
        dispatch(setCurrentPageData(recipes.slice(0, itemsDisplayedPerPage)));
        dispatch(setPrevPageData([]));
        dispatch(setNextPageData(recipes.slice(itemsDisplayedPerPage)));
      }
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  return (
    <section>
      <div className="mx-auto flex items-center justify-center gap-3">
        <Button
          onClick={() => {
            gotoPageNum(1);
          }}
          className="rounded-md px-3 py-2 text-center disabled:bg-[#ffa180]"
          disabled={prevDisable}
          title="start"
        >
          <MdKeyboardDoubleArrowLeft />
        </Button>
        <Button
          onClick={gotoPrevPage}
          className="rounded-md px-3 py-2 text-center disabled:bg-[#ffa180]"
          disabled={prevDisable}
          title="previous"
        >
          <MdKeyboardArrowLeft />
        </Button>
        <div>
          <p className="min-w-28 text-center text-sm">
            Page {curDisplayedPage} of {totalPagesToDisplay}
          </p>
        </div>
        <Button
          onClick={gotoNextPage}
          className="rounded-md px-3 py-2 text-center disabled:bg-[#ffa180]"
          disabled={nextDisable}
          title="next"
        >
          <MdKeyboardArrowRight />
        </Button>
        <Button
          onClick={() => {
            gotoPageNum(totalPagesToDisplay);
          }}
          className="rounded-md px-3 py-2 text-center disabled:bg-[#ffa180]"
          disabled={nextDisable}
          title="end"
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
      </div>
    </section>
  );
};

export default PaginationButtons;
