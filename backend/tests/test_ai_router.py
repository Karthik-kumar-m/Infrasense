import unittest

from app.ai_router import classify_department


class TestAiRouter(unittest.TestCase):
    def test_routes_it_keywords(self):
        self.assertEqual(classify_department("Projector in class is down"), "IT")

    def test_routes_plumbing_keywords(self):
        self.assertEqual(classify_department("Water leak from restroom pipe"), "Plumbing")

    def test_routes_electrical_keywords(self):
        self.assertEqual(classify_department("Light switch is sparking"), "Electrical")

    def test_falls_back_to_general_maintenance(self):
        self.assertEqual(classify_department("Need window cleaning"), "General Maintenance")


if __name__ == "__main__":
    unittest.main()
