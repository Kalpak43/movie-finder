import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "motion/react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";

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
      <div className=" p-2 bg-[var(--highlight-2)] rounded-md text-center shadow-md flex justify-center gap-2 items-center">
        <h1 className="text-2xl font-bold">Recommendations</h1>
      </div>

      <div className="relative">
        <AnimatePresence>
          <Button
            variant={"outline"}
            size={"icon"}
            className="absolute translate-x-[-105%] inset-y-0 my-auto z-10 cursor-pointer text-white hover:text-white bg-blue-400 hover:bg-blue-400"
            onClick={previous}
          >
            <ChevronLeft />
          </Button>
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
              <motion.div key={movie.imdbID} className="px-1  my-8">
                <MovieCard
                  movie={movie}
                  handleAddToFavorties={handleAddToFavorties}
                  handleRemoveFavorites={removeFromFavorites}
                />
              </motion.div>
            ))}
          </Slider>
          <Button
            variant={"outline"}
            size={"icon"}
            className="absolute translate-x-[105%] right-0 inset-y-0 my-auto z-10 cursor-pointer text-white hover:text-white bg-blue-400 hover:bg-blue-700"
            onClick={next}
          >
            <ChevronRight />
          </Button>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MovieCarousel;
