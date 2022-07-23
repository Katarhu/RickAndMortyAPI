
import Navbar from "./Navbar";
import '../Styles/Header.scss';


const Header = () => {
  return (
    <header className="header">
        <div className="header__logo">
            <a href="/" className="header__link">Rick And Morty </a>
        </div>
        <Navbar />
    </header>
  )
}

export default Header