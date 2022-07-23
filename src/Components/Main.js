
import '../Styles/Main.scss'
import Character from './Character';
import SearchForm from './SearchForm';
import Spinner from './Spinner';


import '../Styles/Main.scss';

const Main = ({ searchUserById, searchUserByName, searchType, showedResults, deleteById, addFavouriteUser, clearSearchId, clearSearchName, doNotShowDelete, isLoading = false }) => {
    return (
      <main className="main">
       { searchType ?  <SearchForm searchType={searchType} s
                                   searchUser = { searchType === 'id' ? searchUserById : searchUserByName } 
                                   clearSearch = { searchType === 'id' ? clearSearchId : clearSearchName }/> : '' }

        <div className='main__container'>
          { isLoading ? <Spinner /> :  showedResults.length ? showedResults.map((character) => (
                                <Character key={ character.id } 
                                           character = { character }
                                           deleteById = { deleteById }
                                           addFavouriteUser = { addFavouriteUser }
                                           doNotShowDelete = { doNotShowDelete }/> )) 
                                : 'There is no results yet' }
        </div>
      </main>
    )
}

export default Main