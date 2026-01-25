import requests
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/icd", tags=["ICD"])

WHO_TOKEN_URL = "https://icdaccessmanagement.who.int/connect/token"
WHO_SEARCH_URL = "https://id.who.int/icd/entity/search"

CLIENT_ID = "ed2aad58-fec7-402b-b557-f608222b540a_2098a01d-6416-4094-ad6e-32ac6a3dd182"
CLIENT_SECRET = "Q0BaT/CwG/WUdkqtW0lPtf18cwZwf8YYtnvg9/vEZIU="


def get_token():
    r = requests.post(
        WHO_TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "scope": "icdapi_access",
        },
        headers={"Accept": "application/json"},
        timeout=15,
    )

    if r.status_code != 200:
        raise HTTPException(status_code=500, detail=f"ICD Token Fehler: {r.status_code} {r.text}")

    return r.json().get("access_token")


@router.get("/search")
def search_icd(q: str = Query(..., min_length=2), limit: int = 10):
    token = get_token()

    r = requests.get(
        WHO_SEARCH_URL,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Accept-Language": "en",
            "API-Version": "v2",
        },
        params={"q": q, "limit": limit},
        timeout=15,
    )

    if r.status_code != 200:
        raise HTTPException(status_code=500, detail=f"ICD Suche fehlgeschlagen: {r.status_code} {r.text}")

    data = r.json()

    results = []
    for item in data.get("destinationEntities", []):
        title_obj = item.get("title") or {}
        title = title_obj.get("value") or title_obj.get("@value") or ""

        results.append({
            "code": item.get("theCode"),   # ✅ richtig
            "title": title,
        })

    return results
