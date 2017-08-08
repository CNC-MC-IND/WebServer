// mongoose를 사용하기 위해 해당 모듈을 import
var mongoose    = require('mongoose');
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;

// 스키마 정의
// email, password, token 필드를 가지며 각각의 필드는 string 타입이다.
var Schema       = mongoose.Schema;
var UserSchema   = new Schema({
    email: String,
    password: String,
    token: String,
    organization: String,
    name: String
});

UserSchema.methods.compPassword = function (candidate, cb) {
    bcrypt.compare(candidate, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// 스키마를 이용해서 모델을 정의
// 'User' : mongodb에 저장될 collection이름(테이블명)
// UserSchema : 모델을 정의하는데 사용할 스키마
module.exports = mongoose.model('User', UserSchema);