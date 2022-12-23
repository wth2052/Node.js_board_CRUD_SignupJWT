# Node.js 숙련주차 과제 로그인기능이 있는 게시판 만들기

## 이번 과제의 요구사항

### API 명세서
|기능|API URL|Method|Request|Response|Response(error)|
|---|---|---|---|---|---|
|회원 가입|/signup|POST|{  "email": "test21@gmail.com","nickname": "teeemo12","pwd": "123456","confirmPassword": "123456"}|<br>**#200**<br>{"message": "회원가입에 성공하였습니다."}|**#412**<br> {errorMessage: "닉네임은 최소 3자이상, 알파벳 대소문자, 숫자로만 구성되어야 합니다."}<br>**#412**<br> {errorMessage: "비밀번호는 안전을 위해 4자 이상으로 만들어주세요."}<br>**#412**<br> {errorMessage: "안전을 위해 비밀번호와 닉네임은 다르게 구성해주세요."}<br>**#412**<br>{errorMessage: "패스워드가 패스워드 확인란과 다릅니다. ",}<br>**#412**<br> {errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."}|
|로그인|/signin|POST|{"email":"test1@gmail.com","password": "123456"}|{"token": "eyJhbGciOiJIUzI1NiIs...."}|{errorMessage: '닉네임 또는 비밀번호를 확인해주세요'}|
|게시글 작성|/post|POST|{"user": "teemo0","title": "제목123","content": "내용123","password": "123456123"}|{"success": true,"Message": "게시물 작성에 성공했습니다."}|{errorMessage: "로그인이 필요합니다."})|
|게시글 조회|/post|GET|-|{"posts": [{"id": 1,"user": "teemo0","title": "제목123","content": "내용123","likes": 1,"user_id": 1},{"id": 2,"user": "teemo0","title": "제123","content": "내용123","likes": 0,"user_id": 1},|<br>**#400**<br>{errorMessage:"게시글 조회에 실패하였습니다."}<br>|
|게시글 상세 조회|API URL|Method|Request|Response|Response(error)|
|게시글 수정|API URL|Method|Request|Response|Response(error)|
|게시글 삭제|API URL|Method|Request|Response|Response(error)|
|댓글 생성|API URL|Method|Request|Response|Response(error)|
|댓글 목록 조회|API URL|Method|Request|Response|Response(error)|
|댓글 수정|API URL|Method|Request|Response|Response(error)|
|댓글 삭제|API URL|Method|Request|Response|Response(error)|
|좋아요 게시글 조회|API URL|Method|Request|Response|Response(error)|
|게시글 좋아요|API URL|Method|Request|Response|Response(error)|

1. 회원 가입 API  
    - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기  
   #### -정규표현식을 사용하여 구분하였음
    ```javascript
    const correct_nickname = /^[a-zA-Z0-9]{3,10}$/
    ```
    - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기   
   #### -pwd.length < 4 / 조건 미달시 400에러와 return  
    - 비밀번호 확인은 비밀번호와 정확하게 일치하기  
   #### -pwd !== confirmPassword / true시 400에러와 return   
    - 닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기  
    ``` javascript
    const { email, nickname, pwd, confirmPassword } = req.body;
    ```
    - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 response에 포함하기
    ```javascript
    const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname } ],
    }, });
    ```
    ```javascript
    [User: {
      dataValues: {
        자료들...(계정,비밀번호 값)
    }}]
    ```

    #### existsUsers.length은 위와같은 자료형식으로 담기는데,  existsUsers.length에 해당한다면 중복메세지와 400 반환후 return

2. 로그인 API
    - 닉네임, 비밀번호를 request에서 전달받기  
    ```javascript
    const { email, password } = req.body;
    ```
    - 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤, 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 response에 포함하기
    #### CyrptoJS를 통해 비밀번호를 암호화했기에, 복호화후 그 값을 db내의 값과 비교함
    ```javascript
    const existPw = user.password;
    const decryptedPw = CryptoJS.AES.decrypt(existPw,process.env.keyForDecrypt);
    const originPw = decryptedPw.toString(CryptoJS.enc.Utf8);
    
    originPw != password
    ```   
    - 로그인 성공 시 로그인 토큰을 클라이언트에게 Cookie로 전달하기
    ```javascript
    const token = jwt.sign({ nickname : user.nickname,userId:user.id},process.env.JWT_ACCESS_SECRET, 
    {expiresIn: '30m'});
    res.cookie('id', token, {httpOnly: true});
    ```
    ####  위의 조건식이 일치한다면 jtw토큰에 UserId와 함께 담아 전송, 불일치시 400 반환후 return
3. 로그인 검사
    - `아래 API를 제외하고` 모두 로그인 토큰을 전달한 경우만 정상 response를 전달받을 수 있도록 하기
        - 회원가입 API
        - 로그인 API
        - 게시글 목록 조회 API
        - 게시글 조회 API
        - 댓글 목록 조회 API
        
   #### authMiddleWare를 통해 토큰을 전달받은 경우만 해당하는 API를 호출할수 있게 하였음.
   
    - 로그인 토큰을 전달하지 않은 채로 로그인이 필요한 API를 호출한 경우 "로그인이 필요합니다." 라는 에러 메세지를 response에 포함하기
   #### authMiddleWare를 통해 토큰을 전달받은 경우만 댓글 작성이 가능하게 되어있음.
    - 로그인 토큰을 전달한 채로 로그인 API 또는 회원가입 API를 호출한 경우 "이미 로그인이 되어있습니다."라는 에러 메세지를 response에 포함하기

4. 댓글 목록 조회 API
    - 로그인 토큰을 전달하지 않아도 댓글 목록 조회가 가능하도록 하기
   #### 전달 안해도 목록 조회가능
    - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 response에 포함하기   
    ```javascript
    try {
        const posts = await Post.findAll({
        attributes: ['id', 'user', 'title', 'content', 'likes', 'user_id'],
        order: [['likes', 'DESC']],});
        res.json({posts});
      }catch (err){
        res.status(400).json({errorMessage:"게시글 조회에 실패하였습니다."})
        console.log(err)
      }
    ```
    - 제일 최근 작성된 댓글을 맨 위에 정렬하기   
    
5. 댓글 작성 API
    - 로그인 토큰을 전달했을 때에만 댓글 작성이 가능하도록 하기
    #### authMiddleWare를 통해 토큰을 전달받은 경우만 댓글 작성이 가능하게 되어있음.
    - 로그인 토큰을 전달하지 않은 채로 댓글 작성란을 누르면 "로그인이 필요한 기능입니다." 라는 에러 메세지를 response에 포함하기
    #### authMiddleWare를 통해 토큰을 전달받은 경우만 댓글 작성이 가능하게 되어있음.
    - 댓글 내용란을 비워둔 채 API를 호출하면 "댓글 내용을 입력해주세요" 라는 에러 메세지를 response에 포함하기   
    #### !content || !nickname || !password / 하나라도 입력하지 않을시 400 에러메세지와 함께 return

6. 댓글 수정 API
    - 로그인 토큰에 해당하는 사용자가 작성한 댓글만 수정 가능하도록 하기
    ```javascript
    const check_comment = await Comment.findOne({
      where: { id: comment_id },
      attributes: ["id", "user_id"]
      })
    ```
    #### !check_comment / 자기가 작성한 댓글이 아닐시 400 에러메세지와 함께 return

    - API를 호출한 경우 기존 댓글의 내용을 새로 입력한 댓글 내용으로 바꾸기
    ```javascript
    await Comment.update({
      content
        }, {
          where: { id: comment_id }
        });
    ```
    
7. 댓글 삭제 API
    - 로그인 토큰에 해당하는 사용자가 작성한 댓글만 삭제 가능하도록 하기
    #### !check_comment / 자기가 작성한 댓글이 아닐시 400 에러메세지와 함께 return
8. 게시글 좋아요 API
    - 로그인 토큰을 전달했을 때에만 좋아요 할 수 있게 하기
    #### authMiddleWare를 통해 토큰을 전달받은 경우만 좋아요가 가능하게 되어있음.
    - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
    ```javascript
    const likes = await Post.findOne({
      where: { id: post_id },
      attributes: ["likes"]
      });

    const check_like = await Like.findOne({
      where: {
      post_id: post_id,
      user_id: user_id
          }
      })
    ```
    - 게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기
    ```javascript
    const data = await Post.findOne({
    where: { id: post_id },
    attributes: ["id", "title", "content", "likes"],
    include: [{
        model: Comment,
        attributes: ["id", "content", "createdAt"],
        separate: true,
        order: [["createdAt", "DESC"]]
    }]
    });
    ```
9. 좋아요 게시글 조회 API
    - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
    - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
     
    - 제일 좋아요가 많은 게시글을 맨 위에 정렬하기
    #### order: [["createdAt", "DESC"]] 를 사용해 많은순 내림차정렬을 하였음.
    
10. ★미비된 사항★   
    ### 1. 내 프로젝트에 swagger 적용해보기
    - Open Api Specification(OAS)를 위한 프레임워크 입니다. API들이 가지고 있는 스펙(spec)을 명세, 관리할 수 있으며, 백엔드와 프론트엔드가 협업할 때 사용할 수 있습니다!
    ### 로그인
    - 로그인 토큰을 전달한 채로 로그인 API 또는 회원가입 API를 호출한 경우 "이미 로그인이 되어있습니다."라는 에러 메세지를 response에 포함하기
    ### 댓글
    - 제일 최근 작성된 댓글을 맨 위에 정렬하기
    ### 로그인 + 좋아요
    - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
    - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
    
    
