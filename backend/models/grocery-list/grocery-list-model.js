import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let GroceryListModelSchema = new Schema({
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'GroceryItemModel'
    }],
    home: {
        type: Schema.Types.ObjectId,
        ref: 'HomeModel',
        required: true,
        unique: true,
    }
});

export default mongoose.model('GroceryListModel', GroceryListModelSchema);