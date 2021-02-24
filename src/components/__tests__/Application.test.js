import React from "react";
import axios from "axios";
import {
  render,
  cleanup,
  waitForElement,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from "@testing-library/react";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";

import { fireEvent } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);
describe("Form", () => {
  getByAltText;
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you want to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    // waitForElement(() => getByText(day, "2 spots remaining"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // We want to start by finding an existing interview.
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    //debug()
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    // With the existing interview we want to find the edit button.
    fireEvent.click(getByAltText(appointment, "Edit"));
    // We change the name and save the interview.
    waitForElement(() => getByText(appointment, "Archie Cohen"));
    // We don't want the spots to change for "Monday", since this is an edit.
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    // Read the errors because sometimes they say that await cannot be outside of an async function
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    expect(
      getByText(appointment, "There was an error saving your appointment")
    ).toBeInTheDocument();
  });
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Are you sure you want to delete?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() => getByText(appointment, "Deleting"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();
    expect(
      getByText(appointment, "There was an error deleting your appointment")
    ).toBeInTheDocument();
  });
});
