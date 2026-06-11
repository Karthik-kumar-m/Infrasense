from collections.abc import Iterable


def classify_department(description: str) -> str:
    normalized = description.lower()

    department_keywords: list[tuple[str, Iterable[str]]] = [
        ("IT", ["network", "wifi", "projector", "system", "laptop", "software"]),
        ("Plumbing", ["water", "leak", "faucet", "pipe", "drain", "toilet"]),
        ("Electrical", ["power", "light", "switch", "spark", "socket", "wiring"]),
    ]

    for department, keywords in department_keywords:
        if any(keyword in normalized for keyword in keywords):
            return department

    return "General Maintenance"
