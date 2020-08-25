import React, { useReducer, useEffect } from 'react';
import './App.css';
import Header from '../header/Header';
import Movie from '../movie/Movie';
import Search from '../search/Search';
import { API_KEY, FAVORITES_URL } from '../../constants/api';

const initialState = {
  favorites: false,
  searchValue: '',
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_FAVORITES_SUCCESS':
      return {
        ...state,
        loading: false,
        favorites: true,
        movies: action.payload
      }
    case 'SEARCH_MOVIES_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case 'SEARCH_MOVIES_SUCCESS':
      return {
        ...state,
        loading: false,
        movies: action.payload,
        favorites: false
      };
    case 'SEARCH_MOVIES_FAILURE':
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    case 'SET_SEARCH_VALUE':
      return {
        ...state,
        searchValue: action.payload
      }
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(FAVORITES_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        dispatch({
          type: 'SEARCH_FAVORITES_SUCCESS',
          payload: jsonResponse.Search
        });
      });
  }, []);

  const search = searchValue => {
    dispatch({
      type: 'SET_SEARCH_VALUE',
      payload: searchValue
    });

    dispatch({
      type: 'SEARCH_MOVIES_REQUEST'
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === 'True') {
          dispatch({
            type: 'SEARCH_MOVIES_SUCCESS',
            payload: jsonResponse.Search
          });
        } else {
          dispatch({
            type: 'SEARCH_MOVIES_FAILURE',
            error: jsonResponse.Error
          });
        }
      });
  };

  const { searchValue, favorites, movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">
        {favorites
          ? 'Sharing a few of our favourite movies'
          : `Results for: ${searchValue}`
        }
      </p>
      <div className="movies">
        {loading && !errorMessage
          ? <span>Loading...</span>
          : errorMessage
          ? <div className="errorMessage">{errorMessage}</div>
          : (movies.map((movie, index) => (
              <Movie key={`${index}-${movie.Title}`} movie={movie} />
            ))
        )}
      </div>
    </div>
  );
};

export default App;
