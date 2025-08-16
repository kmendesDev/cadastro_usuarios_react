import { useEffect, useState, useRef } from 'react' //executes as soon as my page is opened
import './style.css'
import Trash from '../../assets/botao-lixeira.png'
import api from '../../services/api'

function Home() {

  const [users, setUsers] = useState([])
  const [sucessMessage, setsucessMessage] = useState([])
  const [errorMessage, seterrorMessage] = useState([])

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
    console.log(users)
  }

  async function createUsers() {
    try {
      const usersFromApi = await api.post('/usuarios', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })
      getUsers()
      // inputName.current.value = ""
      // inputAge.current.value = ""
      // inputEmail.current.value = ""

      setsucessMessage("Usuário adicionado com sucesso")

      setTimeout(() => {
        setsucessMessage("")
      }, 3000);
    } catch (error) {
      setsucessMessage("")
      if (error.response && error.response.data && error.response.data.message) {
        seterrorMessage(error.response.data.message)
      } else {
        seterrorMessage("Erro ao tentar adicionar usuário. Tente novamente !")
      }

      setTimeout(() => {
        seterrorMessage("")
      }, 3000);

    }

  }

  async function deleteUser(id) {
    const usersFromApi = await api.delete(`usuarios/${id}`)
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        {sucessMessage && <p className="sucess-message">{sucessMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input placeholder='Nome' name='nome' type='text' ref={inputName} />
        <input placeholder='idade' name='idade' type='number' ref={inputAge} />
        <input placeholder='email' name='email' type='email' ref={inputEmail} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>
      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUser(user.id)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home
