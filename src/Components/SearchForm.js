
import { useState } from 'react';

import '../Styles/SearchForm.scss';

const SearchForm = ({ searchType, searchUser, clearSearch }) => {

    const [ query, setQuery ] = useState('');

    return (
        <form className="form" onSubmit={(e) => { e.preventDefault() }}>
            <button className='form__search' onClick={ (e) => clearSearch(e) }>Clear results</button>
            <input className="form__input" 
                   type="text" 
                   placeholder={`Enter ${searchType}`}
                   onChange = { (e) => setQuery( e.target.value) }/>
            <button className='form__search' onClick={ (e) => searchUser( e, query ) }>Search</button>
        </form>
    )
}

export default SearchForm