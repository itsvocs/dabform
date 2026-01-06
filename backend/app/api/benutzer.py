"""
Benutzer API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.benutzer import BenutzerCreate, BenutzerUpdate, BenutzerResponse
from app.services import benutzer as benutzer_service
from app.core.dependencies import get_current_user, get_current_admin_user
from app.models.benutzer import Benutzer

# Router erstellen
router = APIRouter(
    prefix="/api/benutzer",
    tags=["Benutzer"]
)

# ===== ENDPOINTS =====

@router.post("/", response_model=BenutzerResponse, status_code=status.HTTP_201_CREATED)
def create_benutzer(
    benutzer: BenutzerCreate,
    db: Session = Depends(get_db)
):
    """
    Neuen Benutzer erstellen
    
    - **email**: Gültige Email-Adresse
    - **vorname**: Vorname (min 1 Zeichen)
    - **nachname**: Nachname (min 1 Zeichen)
    - **passwort**: Passwort (min 8 Zeichen)
    - **rolle**: 'arzt' oder 'admin'
    """
    try:
        db_benutzer = benutzer_service.create_benutzer(db, benutzer)
        return db_benutzer
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e

@router.get("/", response_model=List[BenutzerResponse])
def list_benutzer(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)
):
    """
    Alle Benutzer auflisten
    
    - **skip**: Anzahl zu überspringen (Pagination)
    - **limit**: Maximale Anzahl (max 100)
    """
    #check if current user is admin
    if current_user.rolle != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können alle Benutzer nicht ansehen weil Sie nicht der Admin sind"
        )

    benutzer = benutzer_service.get_all_benutzer(db, skip=skip, limit=limit)
    return benutzer


@router.get("/me", response_model=BenutzerResponse)
def get_my_profile(
    current_user: Benutzer = Depends(get_current_user)
):
    """Eigene Profile holen"""
    return current_user


@router.get("/{benutzer_id}", response_model=BenutzerResponse)
def get_benutzer(
    benutzer_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Benutzer per ID holen
    """
    #check if current user is admin
    if current_user.rolle != "admin" and current_user.id != benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können diesen Benutzer nicht ansehen weil Sie nicht der Admin sind"
        )

    db_benutzer = benutzer_service.get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return db_benutzer

@router.put("/me", response_model=BenutzerResponse)
def update_my_profile(
    benutzer_update: BenutzerUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """Eigene Profile aktualisieren"""
    updated = benutzer_service.update_benutzer(db, current_user.id, benutzer_update)
    return updated

@router.put("/{benutzer_id}", response_model=BenutzerResponse)
def update_benutzer(
    benutzer_id: int,
    benutzer_update: BenutzerUpdate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Benutzer aktualisieren
    """
    #check if current user is admin
    if current_user.rolle != "admin" and current_user.id != benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Berechtigung für diesen Benutzer"
        )

    db_benutzer = benutzer_service.update_benutzer(db, benutzer_id, benutzer_update)

    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return db_benutzer

@router.delete("/{benutzer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_benutzer(
    benutzer_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)
):
    """
    Benutzer löschen
    """
    #check if current user is admin
    if current_user.id == benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können sich nicht selbst löschen"
        )

    success = benutzer_service.delete_benutzer(db, benutzer_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )
    return None

@router.post("/{benutzer_id}/deaktivieren", response_model=BenutzerResponse)
def deactivate_benutzer(
    benutzer_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)
):
    """
    Benutzer deaktivieren
    """
    #check if current user is admin
    if current_user.id == benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können sich nicht selbst deaktivieren"
        )

    db_benutzer = benutzer_service.get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )

    db_benutzer.aktiv = False
    db.commit()
    db.refresh(db_benutzer)
    return db_benutzer

@router.post("/{benutzer_id}/aktivieren", response_model=BenutzerResponse)
def active_benutzer (
    benutzer_id: int,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)
):
    """
    Benutzer aktivieren
    """
    #check if current user is admin
    if current_user.id == benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können sich nicht selbst aktivieren"
        )

    db_benutzer = benutzer_service.get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )

    db_benutzer.aktiv = True
    db.commit()
    db.refresh(db_benutzer)
    return db_benutzer


@router.post("/admin", response_model=BenutzerResponse, status_code=status.HTTP_201_CREATED)
def create_admin_benutzer(
    benutzer: BenutzerCreate,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)  # 🔒 Nur Admin!
):
    """
    Neuen Admin-Benutzer erstellen
    Dieser Endpoint erlaubt die Erstellung von Admin-Benutzern
    """
    #check if current user is admin
    if current_user.rolle != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können keine Admin-Benutzer erstellen weil Sie nicht der Admin sind"
        )

    try:
        # Check ob Email schon existiert
        existing = benutzer_service.get_benutzer_by_email(db, benutzer.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {benutzer.email} existiert bereits"
            )

        # Admin erstellen
        hashed_pw = benutzer_service.hash_password(benutzer.passwort)

        db_benutzer = Benutzer(
            email=benutzer.email,
            passwort_hash=hashed_pw,
            vorname=benutzer.vorname,
            nachname=benutzer.nachname,
            titel=benutzer.titel,
            rolle="admin",
            durchgangsarzt_nr=benutzer.durchgangsarzt_nr,
            praxis_name=benutzer.praxis_name,
            praxis_telefon=benutzer.praxis_telefon
        )

        db.add(db_benutzer)
        db.commit()
        db.refresh(db_benutzer)

        return db_benutzer

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e


@router.put("/{benutzer_id}/rolle", response_model=BenutzerResponse)
def change_benutzer_rolle(
    benutzer_id: int,
    neue_rolle: str,
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_admin_user)  # 🔒 Nur Admin!
):
    """
    Benutzer-Rolle ändern (arzt ↔ admin)
    """
    #check if current user is admin
    if current_user.rolle != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sie können die Rolle eines Benutzers nicht ändern weil Sie nicht der Admin sind"
        )

    # Validiere neue Rolle
    if neue_rolle not in ["arzt", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rolle muss 'arzt' oder 'admin' sein"
        )

    # Admin kann eigene Rolle nicht ändern
    if current_user.id == benutzer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sie können Ihre eigene Rolle nicht ändern"
        )

    db_benutzer = benutzer_service.get_benutzer_by_id(db, benutzer_id)
    if not db_benutzer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Benutzer mit ID {benutzer_id} nicht gefunden"
        )

    db_benutzer.rolle = neue_rolle
    db.commit()
    db.refresh(db_benutzer)

    return db_benutzer
