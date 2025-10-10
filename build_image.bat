@echo off
REM build.bat — Build & push a multi-platform Docker image

REM Check if a version argument is provided
IF "%~1"=="" (
    ECHO Usage: %~nx0 version
    EXIT /B 1
)

SET VERSION=%~1
SET IMAGE_NAME=maxatanasov/postmark_mock

ECHO Building and pushing %IMAGE_NAME%:%VERSION% for arm64 and amd64...

docker buildx build --push --platform linux/arm64,linux/amd64 -t %IMAGE_NAME%:%VERSION% .

IF %ERRORLEVEL% NEQ 0 (
    ECHO Docker build failed!
    EXIT /B %ERRORLEVEL%
)

ECHO.
ECHO ✅ Successfully built and pushed %IMAGE_NAME%:%VERSION%
