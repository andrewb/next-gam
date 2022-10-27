import { render, screen } from "@testing-library/react";
import Ad from "./Ad";
import { AdManagerContext } from "./AdManager";

function setup({
  display = jest.fn(),
  destroy = jest.fn(),
  setUpSlot = jest.fn(),
  isGptEnabled = false,
  targeting = {},
} = {}) {
  return render(
    <AdManagerContext.Provider
      value={{
        display,
        destroy,
        setUpSlot,
        isGptEnabled,
      }}
    >
      <Ad
        id="ad-1"
        adUnitPath="/123/foo/bar"
        sizes={[[970, 250]]}
        placeholder={[970, 250]}
        targeting={targeting}
      />
    </AdManagerContext.Provider>
  );
}

describe("<Ad />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders a <div /> with the correct id", () => {
    setup();
    expect(screen.getByTestId("ad")).toHaveAttribute("id", "ad-1");
  });
  it("sets a placeholder size", () => {
    setup();
    expect(screen.getByTestId("ad")).toHaveAttribute(
      "style",
      "min-width: 970px; min-height: 250px;"
    );
  });
  it("sets up the slot", () => {
    const setUpSlotMock = jest.fn();
    setup({ setUpSlot: setUpSlotMock, targeting: { foo: "bar" } });
    expect(setUpSlotMock).toHaveBeenCalledWith(
      "ad-1",
      {
        adUnitPath: "/123/foo/bar",
        sizes: [[970, 250]],
        targeting: { foo: "bar" },
      },
      expect.any(Function)
    );
  });
  it("calls display if GPT has been been enabled", () => {
    const displayMock = jest.fn();
    setup({ display: displayMock, isGptEnabled: true });
    expect(displayMock).toHaveBeenCalledWith("ad-1");
  });
  it("calls does not call display if GPT is disabled", () => {
    const displayMock = jest.fn();
    setup({ display: displayMock, isGptEnabled: false });
    expect(displayMock).not.toHaveBeenCalled();
  });
  it("destroys the slot on unmount", () => {
    const destroyMock = jest.fn();
    const { unmount } = setup({ destroy: destroyMock });
    unmount();
    expect(destroyMock).toHaveBeenCalledWith("ad-1");
  });
  it("sets additional data attribute hooks", () => {
    const setUpSlotMock = jest.fn((id, ops, onSlotRender) => {
      onSlotRender({
        isEmpty: false,
        creativeId: "123",
        size: [300, 250],
      });
    });
    setup({ setUpSlot: setUpSlotMock, targeting: { foo: "bar" } });
    const el = screen.getByTestId("ad");
    expect(el).toHaveAttribute("data-is-empty", "false");
    expect(el).toHaveAttribute("data-creative-id", "123");
    expect(el).toHaveAttribute("data-creative-size", "300x250");
  });
});
