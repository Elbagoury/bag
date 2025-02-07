import { beforeEach, describe, expect, test } from "@bag/hoot";
import { getService, makeMockEnv } from "@web/../tests/web_test_helpers";

describe.current.tags("headless");

let titleService;

beforeEach(async () => {
    await makeMockEnv();
    titleService = getService("title");
});

test("simple title", () => {
    titleService.setParts({ one: "MyBag" });
    expect(titleService.current).toBe("MyBag");
});

test("add title part", () => {
    titleService.setParts({ one: "MyBag", two: null });
    expect(titleService.current).toBe("MyBag");
    titleService.setParts({ three: "Import" });
    expect(titleService.current).toBe("MyBag - Import");
});

test("modify title part", () => {
    titleService.setParts({ one: "MyBag" });
    expect(titleService.current).toBe("MyBag");
    titleService.setParts({ one: "Zopenerp" });
    expect(titleService.current).toBe("Zopenerp");
});

test("delete title part", () => {
    titleService.setParts({ one: "MyBag" });
    expect(titleService.current).toBe("MyBag");
    titleService.setParts({ one: null });
    expect(titleService.current).toBe("Bag");
});

test("all at once", () => {
    titleService.setParts({ one: "MyBag", two: "Import" });
    expect(titleService.current).toBe("MyBag - Import");
    titleService.setParts({ one: "Zopenerp", two: null, three: "Sauron" });
    expect(titleService.current).toBe("Zopenerp - Sauron");
});

test("get title parts", () => {
    expect(titleService.current).toBe("");
    titleService.setParts({ one: "MyBag", two: "Import" });
    expect(titleService.current).toBe("MyBag - Import");
    const parts = titleService.getParts();
    expect(parts).toEqual({ one: "MyBag", two: "Import" });
    parts.action = "Export";
    expect(titleService.current).toBe("MyBag - Import"); // parts is a copy!
});
