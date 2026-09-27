import os
import uuid

from fastapi import APIRouter
from fastapi import UploadFile, File
from fastapi import BackgroundTasks
from fastapi import HTTPException

from services.detection_service import process_video


router = APIRouter(
    prefix="/detection",
    tags=["Detection"]
)


UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)


analysis_status = {}


@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No video selected"
        )


    allowed = [
        ".mp4",
        ".avi",
        ".mov",
        ".mkv"
    ]


    extension = os.path.splitext(
        file.filename
    )[1].lower()


    if extension not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format"
        )


    analysis_id = str(uuid.uuid4())


    filename = (
        analysis_id +
        extension
    )


    input_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )


    with open(
        input_path,
        "wb"
    ) as buffer:

        while True:

            chunk = await file.read(
                1024 * 1024
            )

            if not chunk:
                break

            buffer.write(chunk)


    analysis_status[analysis_id] = {
        "status": "processing",
        "filename": file.filename,
        "progress": 0
    }


    background_tasks.add_task(
        process_video,
        analysis_id,
        input_path,
        analysis_status,
        RESULT_FOLDER
    )


    return {
        "success": True,
        "analysis_id": analysis_id,
        "filename": file.filename,
        "status": "processing"
    }


@router.get("/status/{analysis_id}")
def get_status(
    analysis_id: str
):

    if analysis_id not in analysis_status:

        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )


    return analysis_status[
        analysis_id
    ]