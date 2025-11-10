from fastapi import APIRouter, Depends, Request

router = APIRouter()

def get_db(request: Request):
    return request.app.state.db

@router.get("/cafes")
async def get_cafes(db=Depends(get_db)):
    """Get all cafes"""
    cafes = await db.caves.find().to_list(length=100)
    return {"status": True, "cafes": cafes}

@router.get("/locations")
async def get_locations(db=Depends(get_db)):
    """Get all locations"""
    locations = await db.locations.find().to_list(length=100)
    return {"status": True, "locations": locations}
