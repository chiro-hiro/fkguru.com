# Làm thế nào để contribute đúng trên GitHub

**Phần lớn lập trình viên sẽ dành thời gian học tập trên hai trang nổi tiếng PornHub và GitHub. Tuy không có nhiều tư liệu bắt mắt nhưng GitHub host một lượng lớn các project open-source. Contribution sẽ là một nhu cầu tất yếu, nhưng contribute như thế nào để mọi người đều vui vẻ là câu chuyện dài với newbee.**

# Giới thiệu

Việc dành thời gian để contribute cho các project open-source không hẳn là vô bổ nó giúp chúng ta hoàn thiện kỹ năng cũng như học thêm về working flow của các nhóm open-source khác nhau, từ đó improve bản thân để đạt được những milestone lớn hơn. Thậm chí với chút ít may mắn các bạn có thể được các công ty để mắt và đưa ra những offer hấp dẫn.

## Tôi là ai đây là đâu?

Đây là tâm lý chung của một thanh niên mới tạo account GitHub, cảm giác khá là khó hiểu khi đang hình dung xem “Wtf is happening over there?”. Sau thời gian làm quen và sử dụng GitHub thấy và project hay hay, mỗi chúng ta sẽ có ý định contribute code của mình cho các project đó.

Nhưng mọi chuyện đâu như là mơ, rào cản thứ nhất là không hiểu rõ cấu trúc project, rào cản thứ hai là ngôn ngữ, rào cản thứ ba là không quen ai, rào cản thứ tư là code sai standard hoặc sai yêu cần từ bên nhận pull request. Vậy là thay vì được chào đón, newbee bị tổng sỉ vã, chửi bới các kiểu. Điều này đôi lúc làm tổn thương và gây ra nhiều dạng ức chế và trầm cảm.

## Họ có quá toxic không?

Sau khi pull request bị reject thì đôi khi lại tạo ra cảm giác tức tối, thậm chí người reject pull request của bạn có khi code cũng chẳng hay lắm. Nhưng cách nói chuyện thì toxic vãi. Thật ra không phải mọi người nhận pull request đều toxic, chỉ là một phần khá đông mà bạn xui xẻo gặp phải. Hoặc do bạn chưa đọc kỹ CONTRIBUTOR guide. Thường các project lớn sẽ có riêng một phần để hướng dẫn bạn tạo một pull request đảm bảo đúng tiêu chuẩn của họ.

## Bắt đầu như thế nào

### 1. Git model của họ là gì? có quy định in-house nào về naming không?

#### a. Merge hay rebase?

Đây là điều bạn nên thuận trọng, team của họ có thể sẽ prefer `rebase` thay vì `merge`. Nên việc tạo pull request kèm theo một đống merge chằng chéo giữa các branches chẳng khác nào tát vào mặt họ. Một team lead nói với mình, _“Bọn tao prefer rebase bởi gì nó cho một history liên tục và đẹp hơn.”_. Mỗi team có lý do riêng nên nếu bạn tôn trọng họ thì bạn sẽ được tôn trọng.

Có một số nhóm khác thì prefer merge, các nhóm perfer merge chủ yếu chỉ quan tâm tới việc làm sao để các features được phát triển song song chứ cũng không cần hình thức lắm. Nhưng tất nhiên cũng có một số luật như, đừng bao giờ merge master vào develop... Những luật này hình thành trong quá trình development hoặc do team đó tự quy định bạn cần phải đọc.

#### b. Họ có tạo branch cho mỗi feature không?

Cái này tùy thuộc team, nhưng điều bạn cần làm là dùng chức năng visualization để xem git graph. Nó sẽ cho bạn thấy sự phát triển của các branch như thế nào, đâu là branch chính. Có prefix cho branch hay không?.

Chẳng hạn có nhiều team có quy định cho branch như sau:

Feature sẽ bắt đầu với `feature/` và tiếp theo sau là tên feature với underscore thay cho space.

Ví dụ: `feature/new_login_form`

Và cứ như vậy chúng ta có `bug/`, `hotfix/`, `misc/`... tùy theo mục đích và sự cần thiết

#### c. Họ có quy định đặt commit message không?

Có rất nhiều team có quy định về commit message rất chặt chẽ, như phải có prefix `[feature]`, `[fix]`, `[document]`... Tuy nhiên có một số team lại có nhiều yêu cầu kỳ cục như: tất cả đều phải là chữ thường, và chia ở thì hiện tại đơn.

Chẳng hạn thay vì: `imrpoving validator's methods` phải là `improve validator's methods`

Ngoài ra còn có những quy tắc khác như kèm theo task id hoặc issue number.

Ví dụ: `#23 improve validator's methods`

Hoặc một số team màu mè hơn như sau:

`[Improve] validator's methods #23`

Bạn cần xerm git log để xem team đang dùng format nào và dùng cho phù hợp

Và nếu cảm thấy muốn nắm rõ hơn hãy đọc quyển này [Pro Git](https://git-scm.com/book/en/v2).

#### d. Họ có thiết lập automation cho project không?

Một số repo có thiết lập automation trong phần project nên khi bạn tạo một pull request giải quyết issue #23 chẳng hạn. Người ta sẽ cần bạn thêm nội dung sau trong pull request:

Ví dụ:

```
Title:
Improve validator's method

Description:
This pull request is enhancing validation, resolve: #23
```

Ngoài resolve thì nó có thể là `close #23`, `fix #23`... bạn dọc thêm [ở đây](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

Để đọc về các thiết lập automation cho project [ở đây](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/configuring-automation-for-project-boards).

#### e. Họ có git hook không?

Nhiều project mình biết thì thường thêm git hook vào để kiểm tra code coverage, thực thi test, kiểm tra commit message… Việc bạn nên làm khi có githook là hãy để im nó làm việc của nó. Việc bạn sữ dụng `git commit --no-verify` là một việc làm khó có thể chấp nhận được.

### 2. Chú ý về CI/CD

CI/CD giúp ích rất nhiều trong development cũng như đảm bảo deliver features đúng hẹn. Phần lớn các team đều có các phần để integrate với travis-ci, circle-ci... nên bạn cần xem liệu mình có cần thêm các thiết lập này để code của bạn hoạt động trên các môi trường của travis or cricle không.

#### a. Code của bạn có pass test cases không?

Thường thì các project đều có test suite và rất nhiều test cases để đảm bảo code quality. Do đó khi bạn thực hiện bug fix thì điều quan trọng là bạn phải pass mọi test cases. Còn trường hợp bạn thêm feature mới thì bạn phải thêm test cases cho features đó. Nó gần như là luật bất thành văn rồi.

#### b. Code của bạn có giảm code coverage không?

Code coverage có thể nói là một tiêu chí để đánh giá xem bao nhiêu bug đã được mặc áo đẹp. Các project với chỉ số coverage càng cao thì có thể nói là độ tin cậy của code càng cao. Vì phần lớn code đã pass qua các test cases. Nên khi pull request của bạn làm giảm code coverage thì không ai muốn merge nó cả.

## 3. Hiểu project và trade-off

Có một số project họ đã chấp nhận code đó là trade-off thì bạn cũng không nên cố chấp sửa nó làm gì. Vì họ cũng đã cân nhắc kha khá, nên thường các pull request đụng vào dạng code này thì ít khi được merge trừ khi nó xuất sắc.

# Tạm kết

Bài viết không dài không ngắn, mình mong các bạn tìm ra được một điều gì đó hữu ích cho bản thân và cùng cho đi nhiều hơn. Nếu bài viết này có chỗ chưa thỏa đáng hoặc sai lỗi chính tả thì các bạn nhẹ tay dùm.
