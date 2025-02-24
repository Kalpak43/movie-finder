import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "motion/react";
import MovieCard from "./MovieCard";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useRef } from "react";

function MovieCarousel({
  moviesWithFav,
  handleAddToFavorties,
  removeFromFavorites,
}: {
  moviesWithFav: MovieType[];
  handleAddToFavorties: (movie: MovieType) => void;
  removeFromFavorites: (movie: MovieType) => void;
}) {
  let sliderRef = useRef<Slider | null>(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Default, but will change based on breakpoints
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "slider",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ bottom: "-25px" }}>
        <ul style={{ color: "blue" }}> {dots} </ul>
      </div>
    ),
    dotsClass: "slick-dots",
  };

  const next = () => {
    sliderRef.current?.slickNext();
  };
  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="max-md:hidden">
      <div className=" p-2 bg-[var(--highlight-2)] rounded-md text-center shadow-md flex justify-between gap-2 items-center">
        <h1 className="text-2xl font-bold">Recommendations</h1>
        <div className="flex items-center gap-2">
          <button className="cursor-pointer" onClick={previous}>
            <CircleChevronLeft />
          </button>
          <button className="cursor-pointer" onClick={next}>
            <CircleChevronRight />
          </button>
        </div>
      </div>

      <AnimatePresence>
        <Slider
          ref={(slider) => {
            if (slider) {
              sliderRef.current = slider;
            }
          }}
          {...settings}
          className="my-6"
        >
          {moviesWithFav.map((movie) => (
            <motion.div
              key={movie.imdbID}
              layout
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ delay: 0.3 }}
              className="px-1"
            >
              <MovieCard
                movie={movie}
                handleAddToFavorties={handleAddToFavorties}
                handleRemoveFavorites={removeFromFavorites}
              />
            </motion.div>
          ))}
        </Slider>
      </AnimatePresence>
    </div>
  );
}

export default MovieCarousel;
