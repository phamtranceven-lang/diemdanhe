<?php
session_start();

const ADMIN_PASSWORD = '251027';
const UPLOAD_DIR = __DIR__ . '/uploads';

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

function is_admin() {
    return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['action'] === 'login') {
        if ($_POST['password'] === ADMIN_PASSWORD) {
            $_SESSION['admin'] = true;
        }
    }

    if ($_POST['action'] === 'logout') {
        session_destroy();
        header("Location: index.php");
        exit;
    }

    if ($_POST['action'] === 'upload' && is_admin()) {
        foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {
            $name = basename($_FILES['files']['name'][$key]);
            move_uploaded_file($tmp_name, UPLOAD_DIR . "/" . $name);
        }
    }

    if ($_POST['action'] === 'delete' && is_admin()) {
        $file = basename($_POST['file']);
        $path = UPLOAD_DIR . "/" . $file;
        if (file_exists($path)) unlink($path);
    }
}

$files = array_diff(scandir(UPLOAD_DIR), ['.', '..']);
sort($files, SORT_NATURAL);
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>File Share</title>
</head>
<body>

<h2>Kho tài liệu</h2>

<?php if (!is_admin()): ?>
<form method="POST">
<input type="hidden" name="action" value="login">
<input type="password" name="password" placeholder="Nhập pass admin">
<button>Login</button>
</form>
<?php else: ?>
<form method="POST" enctype="multipart/form-data">
<input type="hidden" name="action" value="upload">
<input type="file" name="files[]" multiple>
<button>Upload</button>
</form>

<form method="POST">
<input type="hidden" name="action" value="logout">
<button>Logout</button>
</form>
<?php endif; ?>

<hr>

<ul>
<?php foreach ($files as $f): ?>
<li>
<a href="uploads/<?php echo urlencode($f); ?>"><?php echo $f; ?></a>
<?php if (is_admin()): ?>
<form method="POST" style="display:inline;">
<input type="hidden" name="action" value="delete">
<input type="hidden" name="file" value="<?php echo $f; ?>">
<button>Xóa</button>
</form>
<?php endif; ?>
</li>
<?php endforeach; ?>
</ul>

</body>
</html>
