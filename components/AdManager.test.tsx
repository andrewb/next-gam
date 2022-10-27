import { render, screen } from "@testing-library/react";
import AdManager, { AdManagerContext } from "./AdManager";

describe("<AdManager />", () => {
  beforeEach(() => {
    // Mock googletag before each test
    window.googletag = {
      pubads: jest.fn(() => ({
        addEventListener: jest.fn(),
        getSlots: jest.fn(() => {
          return [];
        }),
        enableLazyLoad: jest.fn(),
        enableSingleRequest: jest.fn(),
      })),
      defineSlot: jest.fn(() => ({
        addService: jest.fn(),
        setTargeting: jest.fn(),
      })),
      enableServices: jest.fn(),
      sizeMapping: jest.fn(() => ({
        addSize: jest.fn(),
        build: jest.fn(),
      })),
      cmd: {
        push: (fn: Function) => fn(),
      },
    } as unknown as jest.Mocked<typeof googletag>;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("adds a the GPT script", () => {
    render(
      <AdManager>
        <div />
      </AdManager>
    );
    expect(screen.getByTestId("gpt-script")).toHaveAttribute(
      "src",
      "https://securepubads.g.doubleclick.net/tag/js/gpt.js"
    );
  });
  it("calls `enableLazyLoad` if set", () => {
    const enableLazyLoadMock = jest.fn();

    jest.spyOn(window.googletag, "pubads").mockImplementation(
      () =>
        ({
          addEventListener: jest.fn(),
          enableLazyLoad: enableLazyLoadMock,
          enableSingleRequest: jest.fn(),
        } as unknown as googletag.PubAdsService)
    );

    render(
      <AdManager enableLazyLoad={true}>
        <div />
      </AdManager>
    );

    expect(enableLazyLoadMock).toHaveBeenCalledTimes(1);
  });
  it("does not call `enableLazyLoad` if it is disabled", () => {
    const enableLazyLoadMock = jest.fn();

    jest.spyOn(window.googletag, "pubads").mockImplementation(
      () =>
        ({
          addEventListener: jest.fn(),
          enableLazyLoad: enableLazyLoadMock,
          enableSingleRequest: jest.fn(),
        } as unknown as googletag.PubAdsService)
    );

    render(
      <AdManager enableLazyLoad={false}>
        <div />
      </AdManager>
    );

    expect(enableLazyLoadMock).not.toHaveBeenCalled();
  });
  it("calls `enableSingleRequest` if set", () => {
    const enableSingleRequestMock = jest.fn();

    jest.spyOn(window.googletag, "pubads").mockImplementation(
      () =>
        ({
          addEventListener: jest.fn(),
          enableLazyLoad: jest.fn(),
          enableSingleRequest: enableSingleRequestMock,
        } as unknown as googletag.PubAdsService)
    );

    render(
      <AdManager enableSingleRequest={true}>
        <div />
      </AdManager>
    );

    expect(enableSingleRequestMock).toHaveBeenCalledTimes(1);
  });
  it("does not call `enableSingleRequest` if it is disabled", () => {
    const enableSingleRequestMock = jest.fn();

    jest.spyOn(window.googletag, "pubads").mockImplementation(
      () =>
        ({
          addEventListener: jest.fn(),
          enableLazyLoad: jest.fn(),
          enableSingleRequest: enableSingleRequestMock,
        } as unknown as googletag.PubAdsService)
    );

    render(
      <AdManager enableSingleRequest={false}>
        <div />
      </AdManager>
    );

    expect(enableSingleRequestMock).not.toHaveBeenCalled();
  });
  it("calls `enableServices`", () => {
    render(
      <AdManager>
        <div />
      </AdManager>
    );

    expect(googletag.enableServices).toHaveBeenCalledTimes(1);
  });
  describe("setUpSlot", () => {
    it("defines the slot", () => {
      render(
        <AdManager>
          <AdManagerContext.Consumer>
            {({ setUpSlot }) => {
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                },
                jest.fn()
              );
              return null;
            }}
          </AdManagerContext.Consumer>
        </AdManager>
      );
      expect(window.googletag.defineSlot).toHaveBeenCalledWith(
        "123/foo/bar",
        [[300, 250]],
        "ad-1"
      );
    });
    it("will not define a slot if it already exists", () => {
      render(
        <AdManager>
          <AdManagerContext.Consumer>
            {({ setUpSlot }) => {
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                },
                jest.fn()
              );
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                },
                jest.fn()
              );
              return null;
            }}
          </AdManagerContext.Consumer>
        </AdManager>
      );

      expect(window.googletag.defineSlot).toHaveBeenCalledTimes(1);
    });
    it("adds the pubads service", () => {
      const addServicesMock = jest.fn();

      jest.spyOn(window.googletag, "defineSlot").mockReturnValue({
        addService: addServicesMock,
      } as unknown as jest.Mocked<googletag.Slot>);

      render(
        <AdManager>
          <AdManagerContext.Consumer>
            {({ setUpSlot }) => {
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                },
                jest.fn()
              );
              return null;
            }}
          </AdManagerContext.Consumer>
        </AdManager>
      );

      expect(addServicesMock).toHaveBeenCalled();
    });
    it("sets slot level targeting", () => {
      const setTargetingMock = jest.fn();

      jest.spyOn(window.googletag, "defineSlot").mockReturnValue({
        addService: jest.fn(),
        setTargeting: setTargetingMock,
      } as unknown as jest.Mocked<googletag.Slot>);

      render(
        <AdManager>
          <AdManagerContext.Consumer>
            {({ setUpSlot }) => {
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                  targeting: {
                    foo: ["bar", "baz"],
                  },
                },
                jest.fn()
              );
              return null;
            }}
          </AdManagerContext.Consumer>
        </AdManager>
      );

      expect(setTargetingMock).toHaveBeenCalledWith("foo", ["bar", "baz"]);
    });
    it("defines size mappings", () => {
      const defineSizeMappingMock = jest.fn();

      jest.spyOn(window.googletag, "defineSlot").mockReturnValue({
        addService: jest.fn(),
        defineSizeMapping: defineSizeMappingMock,
      } as unknown as jest.Mocked<googletag.Slot>);

      render(
        <AdManager>
          <AdManagerContext.Consumer>
            {({ setUpSlot }) => {
              setUpSlot(
                "ad-1",
                {
                  adUnitPath: "123/foo/bar",
                  sizes: [[300, 250]],
                  sizeMapping: [
                    [
                      [1024, 768],
                      [300, 250],
                    ],
                    [[0, 0], []],
                  ],
                },
                jest.fn()
              );
              return null;
            }}
          </AdManagerContext.Consumer>
        </AdManager>
      );

      expect(defineSizeMappingMock).toHaveBeenCalled();
    });
  });
});
