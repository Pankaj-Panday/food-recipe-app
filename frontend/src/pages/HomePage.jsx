import React, { useEffect } from "react";
import { Button, Container, RecipeGrid } from "../components";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedItems, resetState } from "../app/recipesSlice";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.recipes.loading);
  const error = useSelector((state) => state.recipes.error);
  const featuredRecipes = useSelector((state) => state.recipes.curPageData);
  const features = [
    {
      imgUrl: "/feature1.svg",
      heading: "Personalized Recipe Recommendations",
      description:
        "Our platform utilizes advanced algorithms to analyze your taste preferences and cooking habits, providing personalized recipe recommendations tailored to your unique palate.",
    },
    {
      imgUrl: "/feature3.svg",
      heading: "Community Recipe Sharing",
      description:
        "Join a vibrant community of food enthusiasts and share your favorite recipes with fellow cooks from around the globe.",
    },
    {
      imgUrl: "/feature2.svg",
      heading: "Interactive Meal Planner",
      description:
        "Take the stress out of meal planning with our intuitive meal planner feature. Easily schedule your weekly meals, add recipes to your calendar, and generate shopping lists with just a few clicks",
    },
  ];

  useEffect(() => {
    const promise = dispatch(fetchFeaturedItems());

    return () => {
      promise.abort();
      dispatch(resetState());
    };
  }, [fetchFeaturedItems, dispatch]);

  let content;

  if (loading) {
    content = (
      <div className="se my-5 flex min-h-[30vh] items-center justify-center text-center text-gray-400 sm:my-10">
        <p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
      </div>
    );
  } else if (error && featuredRecipes?.length === 0) {
    content = (
      <div className="se my-5 flex min-h-[20vh] items-center justify-center text-center text-gray-400 sm:my-10">
        <p className="mb-2 tracking-wide">
          Error: There is some problem fetching recipes
        </p>
      </div>
    );
  } else {
    content = <RecipeGrid recipes={featuredRecipes} />;
  }

  return (
    <>
      <section className="bg-home-page bg-cover bg-center bg-no-repeat py-10 lg:py-20">
        <Container>
          <div className="min-w-80 rounded-lg border-2 border-white/20 bg-white/10 p-5 shadow-md backdrop-blur-xl max-md:mr-auto sm:max-w-xl md:max-w-2xl">
            <h2 className="mb-6 text-4xl font-bold text-white drop-shadow-md sm:text-5xl md:text-7xl">
              Discover Mouthwatering <span>Recipes</span>
            </h2>
            <p className="text-white">
              Browse our collection of carefully curated recipes from around the
              world, handpicked to delight your senses and elevate your home
              cooking experience.
            </p>
            <Button
              className="word-wide mt-5 px-3 py-2 uppercase duration-150"
              onClick={() => {
                navigate("/recipes");
              }}
            >
              All Recipes
            </Button>
          </div>
        </Container>
      </section>
      <section className="my-10 md:my-16">
        <Container>
          <div>
            <h2 className="mb-6 text-3xl font-bold md:mb-12 md:text-5xl">
              What we offer!
            </h2>
            <section className="flex gap-x-5 gap-y-10 max-md:flex-col">
              {features.map((feature, index) => {
                return <FeatureCard key={index} {...feature} />;
              })}
            </section>
          </div>
        </Container>
      </section>
      <Container>
        <hr />
      </Container>
      <section className="my-10 md:my-16">
        <Container>
          <h2 className="mb-6 text-3xl font-bold md:mb-8 md:text-5xl">
            Featured Recipes
          </h2>
          {content}
          {featuredRecipes.length > 0 && (
            <Button
              className="word-wide mx-auto block px-3 py-2 uppercase duration-150"
              onClick={() => {
                navigate("/recipes");
              }}
            >
              View More
            </Button>
          )}
        </Container>
      </section>
    </>
  );
};

const FeatureCard = ({ imgUrl, heading, description }) => {
  return (
    <article className="flex-1 md:p-2">
      <img src={imgUrl} alt="food_item" className="h-14 w-14" />
      <h3 className="mb-2 mt-5 text-lg font-semibold">{heading}</h3>
      <p className="text-gray-500">{description}</p>
    </article>
  );
};

export default HomePage;
