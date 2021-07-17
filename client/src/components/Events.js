import React, { useState, useRef, useContext } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/authContext";
import "./Events.css";
import EventList from "../components/Events/EventList/EventList";
import { gql, useMutation, useQuery } from "@apollo/client";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const authContext = useContext(AuthContext);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelected(null);
  };

  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  const CREATE_EVENT = gql`
    mutation CreateEvent(
      $title: String!
      $description: String!
      $price: Float!
      $date: String!
    ) {
      createEvent(
        eventInput: {
          title: $title
          description: $description
          price: $price
          date: $date
        }
      ) {
        _id
        title
        description
        date
        price
        creator {
          _id
          email
        }
      }
    }
  `;

  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted(data) {
      const updatedEvents = [...events];
      updatedEvents.push({
        _id: data.createEvent._id,
        title: data.createEvent.title,
        description: data.createEvent.description,
        date: data.createEvent.date,
        price: data.createEvent.price,
        creator: {
          _id: authContext.userId,
        },
      });
      setEvents(updatedEvents);
    },
  });

  const modalConfirmHandler = () => {
    setCreating(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    createEvent({
      variables: {
        title,
        description,
        price,
        date,
      },
    });
  };

  const GET_EVENTS = gql`
    query Events {
      events {
        _id
        title
        description
        date
        price
        creator {
          _id
          email
        }
      }
    }
  `;

  const { loading } = useQuery(GET_EVENTS, {
    variables: {
      offset: 0,
      limit: 2,
    },
    onCompleted(data) {
      const { events } = data;
      setEvents(events);
    },
    onError(err) {
      console.log(err);
    },
  });

  const showDetailHandler = (eventId) => {
    const selectedEvent = events.find((e) => e._id === eventId);
    setSelected(selectedEvent);
  };

  const BOOK_EVENT = gql`
    mutation BookEvent($id: ID!) {
      bookEvent(eventId: $id) {
        _id
        createdAt
        updatedAt
      }
    }
  `;

  const [bookEvent] = useMutation(BOOK_EVENT, {
    onCompleted(data) {
      setSelected(null);
    },
    onError(err) {
      console.log(err);
    },
  });

  const bookEventHandler = () => {
    if (!authContext.token) {
      setSelected(null);
      return;
    }

    bookEvent({
      variables: {
        id: selected._id,
      },
    });
  };
  return (
    <React.Fragment>
      {(creating || selected) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          text="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal
          title={selected.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          text={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selected.title}</h1>
          <h2>
            ${selected.price}-{new Date(selected.date).toLocaleDateString()}
          </h2>
          <p>{selected.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <EventList
          events={events}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
