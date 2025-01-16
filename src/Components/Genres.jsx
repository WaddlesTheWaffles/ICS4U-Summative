import "./Genres.css";

function GenresList({ selectGenreId, genresList, genreSelected }) {

    return (
        <div className="genreListContainer">
            <h1 className="genreTitle">Genres</h1>
            <div className="genresList">
                {genresList.map((genre) => (
                    <button key={genre.id} className={`genres ${genreSelected == genre.id ? "selected" : ""}`} onClick={() => selectGenreId(genre.id)} > {genre.genreName} </button>
                ))}
            </div>
        </div>
    );
}

export default GenresList