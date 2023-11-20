import Log from "../models/LogModel.js";
//creating a logged
export const create = async (req, res) => {
  try {
    const logData = new Log(req.body); // Correct instantiation

    if (!logData) {
      return res.status(404).json({ msg: "Log not ingested successfully" });
    }

    await logData.save();
    // Correct save method

    io.emit("logIngested", newLog);

    res.status(200).json({ msg: "Log ingested successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send error message for better debugging
  }
};
//getall  logged
export const getAll = async (req, res) => {
  try {
    const logData = await Log.find();

    if (!logData || logData.length === 0) {
      return res.status(404).json({ msg: "Log data not found" });
    }

    res.status(200).json(logData); // Corrected variable name
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//creating a logged
export const getOne = async (req, res) => {
  try {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
    } = req.query;

    // Use aggregation pipeline for better performance and flexibility
    const pipeline = [];

    // Match stage
    const matchStage = {};
    if (level) matchStage.level = level;
    if (message) matchStage.message = { $regex: message, $options: "i" };
    if (resourceId) matchStage.resourceId = resourceId;
    if (timestamp) matchStage.timestamp = timestamp;
    if (traceId) matchStage.traceId = traceId;
    if (spanId) matchStage.spanId = spanId;
    if (commit) matchStage.commit = commit;
    if (parentResourceId)
      matchStage["metadata.parentResourceId"] = parentResourceId;

    // Add the $match stage only if there are filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add other stages if needed, e.g., sorting, projecting

    // Execute the aggregation pipeline
    const logs = await Log.aggregate(pipeline);

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error filtering logs", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
