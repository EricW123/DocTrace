import { test, expect } from "@playwright/test";
import { DiffSchema } from "../lib/schems";

test("diff schema valid", () => {
    const data = {
        summary: "ok",
        breaking: false,
        risk_score: 0.2,
        changes: []
    };

    expect(() => DiffSchema.parse(data)).not.toThrow();
});