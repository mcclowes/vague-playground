import { describe, it, expect } from "vitest";
import { compile, inferSchema } from "vague-lang";

describe("Vague Language Integration", () => {
  describe("compile", () => {
    it("generates data from a simple schema", async () => {
      const code = `
        schema Person {
          name: string
        }
        dataset Test {
          people: 3 of Person
        }
      `;

      const result = await compile(code);

      expect(result).toHaveProperty("people");
      expect(result.people).toHaveLength(3);
      expect(result.people[0]).toHaveProperty("name");
      expect(typeof result.people[0].name).toBe("string");
    });

    it("generates weighted random values", async () => {
      const code = `
        schema Item {
          status: 1.0: "active" | 0.0: "inactive"
        }
        dataset Test {
          items: 5 of Item
        }
      `;

      const result = await compile(code);

      expect(result.items).toHaveLength(5);
      // With 100% weight on "active", all should be active
      result.items.forEach((item: { status: string }) => {
        expect(item.status).toBe("active");
      });
    });

    it("generates numbers in range", async () => {
      const code = `
        schema Product {
          price: decimal in 10..20
        }
        dataset Test {
          products: 10 of Product
        }
      `;

      const result = await compile(code);

      result.products.forEach((product: { price: number }) => {
        expect(product.price).toBeGreaterThanOrEqual(10);
        expect(product.price).toBeLessThanOrEqual(20);
      });
    });

    it("throws on invalid syntax", async () => {
      const code = `
        schema Invalid {
          this is not valid vague code
        }
      `;

      await expect(compile(code)).rejects.toThrow();
    });
  });

  describe("inferSchema", () => {
    it("infers schema from object with array", () => {
      // inferSchema expects object with named collections, not plain arrays
      const data = {
        people: [
          { name: "Alice", age: 30 },
          { name: "Bob", age: 25 },
        ],
      };

      const schema = inferSchema(data);

      expect(schema).toContain("schema");
      expect(schema).toContain("People"); // Uses collection name, not singularized
      expect(schema).toContain("name");
      expect(schema).toContain("age");
      expect(schema).toContain("dataset");
    });

    it("infers schema from object with collections", () => {
      const data = {
        users: [
          { email: "test@example.com", active: true },
          { email: "other@example.com", active: false },
        ],
      };

      const schema = inferSchema(data);

      expect(schema).toContain("User");
      expect(schema).toContain("email");
      expect(schema).toContain("active");
    });
  });
});
