import React, { useState, useRef, useEffect, useContext } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/authContext";
import "./Events.css";
import EventList from "../components/Events/EventList/EventList";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchEvents();
  }, []);

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

    // const event = { title, price, date, description };
    // console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title:String!, $description:String!, $price:Float!, $date:String! ) {
            createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
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
        `,
      variables: {
        title,
        description,
        price,
        date,
      },
    };

    const token = authContext.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: authContext.userId,
          },
        });
        // fetchEvents();
        setEvents(updatedEvents);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEvents = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query {
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
        `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const eventss = resData.data.events;
        setEvents(eventss);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        throw err;
      });
  };

  const showDetailHandler = (eventId) => {
    const selectedEvent = events.find((e) => e._id === eventId);
    setSelected(selectedEvent);
  };

  const bookEventHandler = () => {
    if (!authContext.token) {
      setSelected(null);
      return;
    }
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId:$id) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
      variables: {
        id: selected._id,
      },
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authContext.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        setSelected(null);
      })
      .catch((err) => {
        console.log(err);
        throw err;
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
