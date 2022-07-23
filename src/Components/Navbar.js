import { Link } from 'react-router-dom';
import '../Styles/Navbar.scss';

const Navbar = () => {
  return (
    <nav className="nav">
        <ul className="nav__menu">
            <li className="nav__item"><Link className='nav__link' to="/">Search by id</Link></li>
            <li className="nav__item"><Link className='nav__link' to="/name">Search by name</Link></li>
            <li className="nav__item"><Link className='nav__link' to="/favorites">Favorites</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar