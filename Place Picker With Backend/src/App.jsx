import { useRef, useState, useCallback,useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import Error from './components/Error.jsx';
import { updateUserPlaces, fetchUserSelectedPlaces } from './components/http.js';

function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const places = await fetchUserSelectedPlaces();
        setUserPlaces(places);

      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch user selected places, please try again later.',
        });
        
      }
     
    }
    fetchPlaces();
  }, []);

  async function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);

    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update places.',
      });
    }
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);

  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      if(!userPlaces.some(place => place.id === selectedPlace.id)) {
          await updateUserPlaces([selectedPlace, ...userPlaces]);
      }
      
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update places.',
      });
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    setModalIsOpen(false);
    try {
      await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id));
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update places.',
      });
    }
  }, [userPlaces]);
  function handleError() {
    setErrorUpdatingPlaces(null);
  }
  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
