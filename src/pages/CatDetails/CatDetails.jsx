import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './CatDetails.css'

// Services
import { getOne, assocToy } from '../../services/cats'



// Components
import Feedings from './components/Feedings'
import CatActions from './components/CatActions'
import ToyCollection from './components/ToyCollection'

const CatDetails = ({ catImages, user }) => {
  const { id } = useParams()
  const [cat, setCat] = useState(null)
  const [availableToys, setAvailableToys] = useState([])
  const idx = Math.floor(Math.random() * (catImages.length))

  const addToCollection = async (e) => {
    e.preventDefault()
    const toyId = parseInt(e.target.id)
    const updatedCat = await assocToy(cat.id, toyId)
    setAvailableToys(availableToys.filter(toy => toyId !== toy.id))
    setCat({...updatedCat, fed: cat.fed})
  }

  useEffect(() => {
    const fetchOne = async () => {
      const data = await getOne(id)
      setCat(data.cat)
      setAvailableToys(data.available_toys)
    }
    fetchOne()
  }, [id])


  if (!cat) return <h1>Loading</h1>

  return (
    <>
      <section className="cat-container">
        <div className="cat-img">
          <img className="usr-img" src={catImages[idx]} alt={`${cat.name}`} />
        </div>
        <div className="cat-details">
          <h1>{cat.name}</h1>
          {cat.age > 0
            ? <h2>A {cat.age} year old {cat.breed}</h2>
            : <h2>A {cat.breed} kitten.</h2>
          }
          <p>{cat.description}</p>
          <CatActions cat={cat} user={user} />
        </div>
      </section>
      <div className="feedings-toy-container">
        <Feedings
          cat={cat}
          user={user}
          setCat={setCat}
        />
        <ToyCollection
          cat={cat}
          user={user}
          toys={availableToys}
          addToCollection={addToCollection}
        />
      </div>
    </>
  )
}

export default CatDetails