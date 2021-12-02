# DO NOT EDIT BELOW THIS ===================================
# Pull Hub API base image
FROM 495274804427.dkr.ecr.us-east-1.amazonaws.com/hub-api-base:latest

# Create and set function dir
ARG FUNCTION_DIR="/function/"
RUN mkdir -p ${FUNCTION_DIR}
WORKDIR ${FUNCTION_DIR}

# Copy source code
COPY src/* ${FUNCTION_DIR}
# =================================== DO NOT EDIT ABOVE THIS

# ADD/EDIT YOUR COMMANDS HERE

RUN pip install -r requirements.txt --target ${FUNCTION_DIR}

# ==================== DO NOT EDIT =========================
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "main.inference_handler" ]
# ==========================================================