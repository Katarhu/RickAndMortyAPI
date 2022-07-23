
import { useState } from 'react';
import '../Styles/Character.scss';

import { FaRegTrashAlt } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

const Character = ({ character, deleteById, addFavouriteUser, doNotShowDelete }) => {

    const [ isFavorite, setFavoriteState ] = useState( character.favorite );

    return (
        <div className="character">
            <div className="character__image">
                <img className='character__img' src={ character.image } alt={character.name} />
            </div>
            <div className='charachter__name'>
                { character.name }
            </div>
            <div className="character__controls">
                <button className={`icon-button ${ isFavorite ? 'favorite' : ''}`} 
                        onClick={ () => { addFavouriteUser( character ); setFavoriteState( !isFavorite ); } }> <FaHeart /> </button>
                { doNotShowDelete ? '' :<button className='icon-button' onClick = { () => { deleteById( character.id ); } }> <FaRegTrashAlt /> </button>}
            </div>
        </div>
    )
}

export default Character