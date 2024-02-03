"use client";
import { Booking } from "@/api/booking";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const Pdf = ({ bookingDetail }: { bookingDetail: Booking }) => {
  const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 20,
    },

    page: {
      flexDirection: "column",
      backgroundColor: "white",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/** Header */}
        <Text style={styles.header}>Phish.it</Text>

        {/** Location */}
        <View style={styles.section}>
          <Text>Naxal, Kathmandu</Text>
        </View>

        {/** Booking Details */}
        <View style={styles.section}>
          <Text>ID: {bookingDetail._id}</Text>
          <Text>{bookingDetail.package.title}</Text>
          <Text>Guide: {bookingDetail.guide.username}</Text>
          <Text>Payed Through: {bookingDetail.payment?.method}</Text>
          <Text>Rs. {bookingDetail.payment?.amount}</Text>
        </View>
      </Page>
    </Document>
  );
};
export default Pdf;
