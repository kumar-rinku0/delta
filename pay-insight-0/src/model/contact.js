import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        companyCode: { type: String, required: true },
        comments: { type: String, required: true },
    },
    { timestamps: true }
);

const Contact = model('Contact', contactSchema);

export default Contact;
