<!-- ==================== This code was made by me ==================== -->

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
            $sql = "INSERT INTO usuarios(cedula, nombre, mesa) VALUES (?,?,?)";
            $stmt = $pdo->prepare($sql);

            $sqlMD = "SELECT nombre FROM usuarios WHERE cedula = ?";
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
                    $stmt->execute([$cedula, $nombre, $mesa]);
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

            case 'cargarProductos':
                try{
                    $categoria = $_POST["categoriaa"];

                    $sql = "SELECT * FROM productos WHERE categoria = ?";

                    $stmt = $pdo->prepare($sql);

                    $stmt->execute([$categoria]);

                    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    echo json_encode($productos);
                } catch (Exception $e) {
                    $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                    echo json_encode($response);
                }
                $response["errores"][] = "";
                break;

            case 'agregarCarrito':
                $id_producto = $_POST["id_producto"];
                $cedula = $_POST["cedula"];
                $cantidad = $_POST["cantidad"];

                date_default_timezone_set('America/Bogota');
                $fecha = date('Y-m-d H:i:s');

                try {
                    $sql = "INSERT INTO pedidos(id_producto, id_usuario, estado, fecha_pedido, cantidad, proceso) VALUES (?, ?, 'Mirando', ?, ?, 'Pendiente')";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$id_producto, $cedula, $fecha, $cantidad]);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                    echo json_encode($response);
                }
                break;

            case 'carrito':
                $cedula = $_POST["cedula"];
                try {
                    $sql = "SELECT ped.id AS id_pedido, p.nombre, p.precio, p.foto, ped.cantidad, ped.estado,ped.proceso FROM pedidos ped JOIN productos p ON ped.id_producto = p.id WHERE ped.id_usuario = ? AND ped.estado IN ('Mirando', 'Correcto');";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$cedula]);
                    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($productos);
                } catch (Exception $e) {
                    $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                    echo json_encode($response);
                }
                break;

            case 'eliminarPedido':
                $id = $_POST["id_pedido"];
                try {
                    $sql = "DELETE FROM pedidos WHERE id = ?;";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$id]);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                    echo json_encode($response);
                }
                break;

            case 'confirmarPedido':
                $id_pedido = $_POST["id_pedido"];
                $numPed = $_POST["numPed"];
                $estado = "Correcto";
                try {
                    $sql ="UPDATE pedidos SET estado = ?, cantidad = ? WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$estado, $numPed, $id_pedido]);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    $response["errores"][] = "Error Interno, Vuelve a intentarlo.";
                    echo json_encode($response);
                }
                break;

            case 'obtenerPedidosHoyPorTodos':
                $fecha = $_POST['fecha'] ?? null;
                // $fecha = '2025-10-15';
                if (!$fecha) {
                    echo json_encode(['success' => false, 'error' => 'Falta fecha.']);
                    break;
                }

                try {
                    $sql = "SELECT
                                u.cedula,
                                u.nombre AS nombre_usuario,
                                u.mesa,
                                ped.id AS id_pedido,
                                ped.estado,
                                ped.proceso,
                                ped.fecha_pedido,
                                p.id AS id_producto,
                                p.nombre AS nombre_producto,
                                p.ingrediente,
                                p.categoria,
                                p.precio AS precio_str,
                                ped.cantidad AS cantidad_str
                            FROM pedidos ped
                            JOIN usuarios u ON ped.id_usuario = u.cedula
                            JOIN productos p ON ped.id_producto = p.id
                            WHERE DATE(ped.fecha_pedido) = ?
                            AND ped.proceso IN ('Pendiente', 'Preparando', 'Entregado')
                            ORDER BY u.mesa, ped.fecha_pedido;";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$fecha]);
                    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    // Agrupar por usuario (cedula) y calcular subtotales y totales
                    $usuarios = [];
                    foreach ($rows as $r) {
                        $cedula = $r['cedula'];
                        // Normalizar precio y cantidad (quitar símbolos no numéricos)
                        $precio = floatval(preg_replace('/[^\d.,-]/', '', $r['precio_str']));
                        // Reemplazar coma decimal por punto si existe
                        $precio = floatval(str_replace(',', '.', strval($precio)));
                        $cantidad = intval(preg_replace('/\D/', '', $r['cantidad_str']));

                        $subtotal = $precio * $cantidad;

                        if (!isset($usuarios[$cedula])) {
                            $usuarios[$cedula] = [
                                'cedula' => $cedula,
                                'nombre_usuario' => $r['nombre_usuario'],
                                'mesa' => $r['mesa'],
                                'pedidos' => [],
                                'total' => 0
                            ];
                        }

                        $usuarios[$cedula]['pedidos'][] = [
                            'id_pedido' => $r['id_pedido'],
                            'id_producto' => $r['id_producto'],
                            'nombre_producto' => $r['nombre_producto'],
                            'ingrediente' => $r['ingrediente'],
                            'categoria' => $r['categoria'],
                            'precio' => $precio,
                            'cantidad' => $cantidad,
                            'subtotal' => $subtotal,
                            'proceso' => $r['proceso'],
                            'estado' => $r['estado'],
                            'fecha_pedido' => $r['fecha_pedido']
                        ];

                        $usuarios[$cedula]['total'] += $subtotal;
                    }

                    echo json_encode(['success' => true, 'usuarios' => array_values($usuarios)]);
                } catch (Exception $e) {
                    // opcional: loguear $e->getMessage()
                    echo json_encode(['success' => false, 'error' => 'Error interno al obtener pedidos.']);
                }
                break;

            case 'actualizarEstadoPedido':
                $id_pedido = $_POST['id_pedido'];
                $nuevo_estado = $_POST['nuevo_estado'];

                try {
                    $sql = "UPDATE pedidos SET proceso = ? WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$nuevo_estado, $id_pedido]);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    echo json_encode(['success' => false, 'error' => 'Error al actualizar el estado']);
                }
                break;

            default:
                echo json_encode("Error");
        }
    }

?>