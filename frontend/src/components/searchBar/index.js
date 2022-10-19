import { useHistory } from "react-router-dom"
import { useState } from "react";
export default function SearchBar() {
    const history = useHistory();
    const [params, setParams] = useState("")
    function handleSubmit(e) {
        e.preventDefault();
        history.push(`/search?${params}`)
    }
    return (
        <form className='search' onSubmit={handleSubmit} >
            <div className='searchContainer'>
                <textarea
                    placeholder="Search for a spot"
                    type="text"
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                ></textarea>
            </div>
            <button className='overrideButton'> Search</button>
        </form>
    )
}
