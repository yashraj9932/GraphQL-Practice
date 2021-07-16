import React, { useState, useEffect } from "react";

import BookingsChart from "./Bookings/BookingsChart";
import BookingList from "../components/Bookings/BookingList";

import { useLazyQuery, gql, useMutation } from "@apollo/client";

const BookingsPage = () => {
  // const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [lct, setLct] = useState("list");

  const FETCH_BOOKINGS = gql`
    query Bookings {
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
  `;

  const DELETE_BOOKING = gql`
    mutation CancelBooking($id: ID!) {
      cancelBooking(bookingId: $id) {
        _id
        title
      }
    }
  `;

  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    onCompleted(data) {
      console.log(data);
    },
    onError(err) {
      console.log(err);
      // setLoading(false);
    },
  });

  const [getBookings, { loading, data }] = useLazyQuery(FETCH_BOOKINGS, {
    onCompleted(data) {
      console.log(data);
      const { bookings } = data;
      setBookings(bookings);
      // setLoading(false);
      console.log(loading);
    },
    onError(err) {
      console.log(err);
      // setLoading(false);
    },
  });
  console.log(loading);

  useEffect(() => {
    // fetchBookings();
    getBookings();

    // eslint-disable-next-line
  }, [data]);

  // const fetchBookings = () => {
  //   // setLoading(true);
  // };

  const deleteBookingHandler = (bookingId) => {
    // setLoading(true);
    deleteBooking({
      variables: {
        id: bookingId,
      },
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
            <BookingsChart bookings={bookings} />
          )}
        </>
      )}
    </>
  );
};

export default BookingsPage;
