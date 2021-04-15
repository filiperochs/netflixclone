import React, { useEffect, useState } from "react";

import "./App.css";

import tmdb from "./tmdb";

import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from './components/Header';

import loadingGif from './assets/loading.svg';

export default function App() {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando todas as informações das listas

      let list = await tmdb.getHomeList();

      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter((i) => i.slug === "originals");

      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );

      let chosen = originals[0].items.results[randomChosen];

      let chosenInfo = await tmdb.getMovieInfo(chosen.id, "tv");

      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 30) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
          Feito com <span role="img" aria-label="coração">❤</span> por&nbsp;
          <a href="https://filiperochs.github.io">Filipe R.</a><br />
          Direitos de imagem para Netflix<br />
          Dados disponibilizados da API pública&nbsp;
          <a href="https://www.themoviedb.org/">TMDb</a>
      </footer>
      
      {movieList.length <= 0 &&
        <div className="loading">
          <img src={loadingGif} alt="Carregando..." />
        </div>
      }
    </div>
  );
}
