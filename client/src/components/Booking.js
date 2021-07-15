import React, { useState, useContext, useEffect } from "react";

import AuthContext from "../context/authContext";
// import BookingsChart from "./Bookings/BookingsChart";
import BookingList from "../components/Bookings/BookingList";

const BookingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [lct, setLct] = useState("list");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
               price
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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const deleteBookingHandler = (bookingId) => {
    setLoading(true);
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!){
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId,
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
        const updatedBookings = bookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        setBookings(updatedBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const Spinner = () => {
    return (
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
    );
  };

  const listChart = (outputType) => {
    if (outputType === "list") {
      setLct("list");
    } else {
      setLct("chart");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="bookings-control">
            <button
              className={lct === "list" ? "active" : ""}
              onClick={() => listChart("list")}
            >
              List
            </button>
            <button
              className={lct === "chart" ? "active" : ""}
              onClick={() => listChart("chart")}
            >
              Chart
            </button>
          </div>
          {lct === "list" ? (
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
          ) : (
            {
              /* <BookingsChart bookings={bookings} /> */
            }
          )}
        </>
      )}
    </>
  );
};

export default BookingsPage;
