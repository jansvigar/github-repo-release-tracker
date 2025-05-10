import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "@/utils/test";
import Header from "../Header";

describe("Header", () => {
  test("renders the app title as a level-1 heading", () => {
    renderWithTheme(<Header />);
    const heading = screen.getByRole("heading", { level: 1, name: /GitHub Release Tracker/i });
    expect(heading).toBeInTheDocument();
  });
});
