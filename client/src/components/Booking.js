import React, { useEffect, useState } from "react";

import BookingsChart from "./Bookings/BookingsChart";
import BookingList from "../components/Bookings/BookingList";

import { gql, useMutation, useQuery } from "@apollo/client";

const BookingsPage = () => {
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
      }
    }
  `;

  const updateBoo = (bookingId) => {
    const updatedBookings = bookings.filter((booking) => {
      return booking._id !== bookingId;
    });
    setBookings(updatedBookings);
  };

  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    onCompleted(data) {
      // console.log(data);
      updateBoo(data.cancelBooking._id);
    },
    onError(err) {
      console.log(err);
    },
  });

  const { loading } = useQuery(FETCH_BOOKINGS, {
    onCompleted(data) {
      const { bookings } = data;
      setBookings(bookings);
    },
    onError(err) {
      console.log(err);
    },
    // pollInterval: 15000,
    // notifyOnNetworkStatusChange: true,
  });

  // useEffect(() => {
  //   console.log(refetch);
  // }, []);

  const deleteBookingHandler = (bookingId) => {
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
