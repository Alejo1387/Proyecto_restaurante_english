<?php
    ob_clean();
    header("Content-Type: application/json");
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    require_once "../conexion_DB/conexion.php";

    function iniciarSecion() {
        global $pdo;

        $nombre = $_POST["usuario"];
        $cedula = $_POST["NCedula"];
        $mesa = $_POST["NMesa"];

        $response = [
            "errores" => []
        ];

        if (mb_strlen($nombre, 'UTF-8') > 60) {
            $response["errores"][] = "El Nombre tiene una longitub mayor a lo permitido";
        }
        if (mb_strlen($cedula, 'UTF-8') > 20) {
            $response["errores"][] = "La Cedula tiene una longitub mayor a lo permitido";
        }
        if (mb_strlen($cedula, 'UTF-8') < 6) {
            $response["errores"][] = "La Cedula tiene una longitub menor a lo permitido";
        }
        if (mb_strlen($mesa, 'UTF-8') > 3) {
            $response["errores"][] = "La Mesa tiene una longitub Mayor a lo permitido";
        }

        if (!empty($response["errores"])) {
            echo json_encode($response);
            exit;
        } else {
            $sql = "INSERT INTO usuarios(nombre, cedula, mesa) VALUES (?,?,?)";
            $stmt = $pdo->prepare($sql);

            $sqlMD = "SELECT id FROM usuarios WHERE cedula = ?";
            $stmt2 = $pdo->prepare($sqlMD);

            try {
                $stmt2->execute([$cedula]);

                if ($stmt2->rowCount() > 0) {
                    $response["descuento"] = "No";

                    $sqlUpdate = "UPDATE usuarios SET mesa = ? WHERE cedula = ?";
                    $stmtUpdate = $pdo->prepare($sqlUpdate);
                    $stmtUpdate->execute([$mesa, $cedula]);
                    echo json_encode($response);
                    exit;
                } else {
                    $response["descuento"] = "Si";
                    $stmt->execute([$nombre, $cedula, $mesa]);
                    echo json_encode($response);
                    exit;
                }
            } catch (Exception $e) {
                $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                echo json_encode($response);
            }
            $response["errores"] = [];
            exit;
        }


    }


    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $funcion = $_POST["funcion"];

        switch ($funcion) {
            case 'iniciarSecion':
                iniciarSecion();
                break;
            default:
                echo json_encode("Error");
        }
    }

?>