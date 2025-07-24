import User from "../models/user.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import moment from 'moment';
import geminiResponse from "../config/gemini.js";
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: 'No user found.' });
        }
        const user = await User.findById(userId).select('-password');
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'getCurretnUser error from controller, Internal Server Error.' });
    }
}
export const updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const { assistantName, assistantImage: imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            assistantImage = (await uploadOnCloudinary(req.file.path)).url;
        } else {
            assistantImage = imageUrl;
        }
        const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password");
        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: 'updateUser error from controller, Internal Server Error.' });
    }
}

export const aiAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const userId = await User.findById(req.userId);
        userId.history.push(command);
        await userId.save();
        const userName = userId.name;
        const assistantName = userId.assistantName;
        const response = await geminiResponse(command, userName, assistantName);
        console.log(response)

        const jsonMatch = response.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ message: 'Sorry I did not understand.' });
        }

        let geminiResult = JSON.parse(jsonMatch[0]);
        const type = geminiResult.type;

        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `Current date is ${moment().format('YYYY-MM-DD')}`
                });
            case 'get_time':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `Current time is ${moment().format('hh:mm A')}`
                });
            case 'get_day':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `Today is ${moment().format('dddd')}`
                });
            case 'get_date':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `Today is ${moment().format('MMMM')}`
                });
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather-show':
            case 'general':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: geminiResult.response
                })
            default:
                return res.status(400).json({ message: 'Sorry I did not understand the command.' });

        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'aiAssistant error from controller, Internal Server Error.' });
    }

}