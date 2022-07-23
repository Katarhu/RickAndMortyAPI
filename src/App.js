
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import Header from "./Components/Header";
import Main from './Components/Main';
import Footer from './Components/Footer';

function App() {
  const API_URL = 'https://rickandmortyapi.com/api/character/';

  const [ resultsById, setResultsById ] = useState([]);
  const [ favorites, setFavorites ] = useState([]);
  const [resultsByName, setResultsByName ] = useState([]);
  const [ isLoading, setLoading ] = useState( false );

  useEffect(() => {
    const idResults = JSON.parse(localStorage.getItem('resultsById'));
    setResultsById(idResults || []);

    const favoriteResults = JSON.parse( localStorage.getItem('favoriteResults'));
    setFavorites( favoriteResults || [] );
  }, []);

  useBeforeunload(() => {
    localStorage.setItem( 'resultsById', JSON.stringify(resultsById) );
    localStorage.setItem( 'favoriteResults', JSON.stringify(favorites) );
  });

  let maximumID;

  (async () => {
    const response = await fetch( API_URL );
    const body = await response.json();

    maximumID = body.info.count;
  })();

  const clearSearchId = () => {
    setResultsById([]);
  }
  const clearSearchName = () => {
    setResultsByName([]);
  }

  const searchById = async( id ) => {
    const response = await fetch( API_URL + id );
    
    return await response.json();
  }

  const deleteById = ( id ) => {
    setResultsById([...resultsById.filter(( character ) => character.id !== id)]);
  }

  const addFavouriteUser = ( character ) => {
    const isCharacterLiked = favorites.filter(( favorite ) => favorite.id === character.id ).length;

    if( !isCharacterLiked ) {
      character.favorite = true;
      setFavorites([character, ...favorites]);
    } else {
      character.favorite = false;
      deleteFavoriteCharacter( character.id )
    }
  }

  const deleteFavoriteCharacter = ( id ) => {
    setFavorites( favorites.filter((favorite) => favorite.id !== id ));
  }

  const searchUserById = async ( e, id ) => {
    e.preventDefault();

    id = +id;

    if ( !id ) {
      alert('Please enter ID');
      return
    }

    if( id < 1 || id > maximumID ) {
      alert('There is no such id');
      return;
    } 

    const isCharacterInResults = resultsById.filter((character) => character.id === id).length;
    if( isCharacterInResults ) {
      alert('There is character with this ID');
      return;
    }

    const charachterBody = await ( searchById( id ) );

    const isCharacterLiked = favorites.filter((liked) => liked.id === id ).length;

    if( isCharacterLiked ) {
      charachterBody.favorite = true;
    } else {
      charachterBody.favorite = false;
    }

    setResultsById([charachterBody, ...resultsById]);
  }

  const getResultsByName = async( name, url ) => {
    const response = await fetch( url );
    const body = await response.json();

    const results = [];
    setLoading( true );

    body.results.forEach((character) => {
      if( (new RegExp(`${name.toLowerCase()}`, 'g')).test(character.name.toLowerCase()) ) {
        const isCharacterLiked = favorites.filter((liked) => liked.id === character.id ).length;
        if( isCharacterLiked ) {
          character.favorite = true;
        }
        results.push( character );
      }
    });

    if( body.info.next ) {
      results.push(...(await getResultsByName( name, body.info.next )));
    }

    return results;
  }

  const searchUserByName = async ( e, name ) => {
    if( !name ) {
      alert('Please enter name');
      return;
    }

    const results = await getResultsByName( name, API_URL );
    setLoading( false );
    setResultsByName( results );
  }

  return (
    <Router>
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/" element={ <Main searchUserById = { searchUserById } 
                                          searchType = {'id'}
                                          showedResults = { resultsById } 
                                          addFavouriteUser = { addFavouriteUser }
                                          clearSearchId = { clearSearchId}
                                          deleteById = { deleteById }/>}/>

          <Route path="/name" element={ <Main searchUserByName = { searchUserByName } 
                                              searchType = {'name'}
                                              showedResults = { resultsByName } 
                                              clearSearchName = { clearSearchName }
                                              addFavouriteUser = { addFavouriteUser }
                                              doNotShowDelete = { true }
                                              isLoading = { isLoading } />}/>

          <Route path="/favorites" element={ <Main  showedResults = { favorites } 
                                                    addFavouriteUser = { addFavouriteUser }
                                                    deleteById = { deleteById }
                                                    doNotShowDelete = { true } />}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
