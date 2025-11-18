-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2025 a las 04:17:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rendicion_cuenta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id` int(11) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `categoria` enum('admin','super_admin') NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id`, `dni`, `nombre`, `password`, `categoria`, `estado`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '40346175', 'MARTHA LUZ TUÑOQUE JULCAS', '$2y$10$n7ZurrZsQR/Ha6liA4SoGun3jEggeie2hxBA09wXeVP8mOplHWT8e', 'super_admin', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `baner_rendicion`
--
CREATE TABLE `baner_rendicion` (
  `id` int(11) NOT NULL,
  `id_rendicion` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `baner_rendicion`
--

INSERT INTO `baner_rendicion` (`id`, `id_rendicion`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '2025-11-18 02:50:22', '2025-11-18 02:50:22', NULL),
(2, 2, '2025-11-18 02:54:47', '2025-11-18 02:54:47', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eje`
--

CREATE TABLE `eje` (
  `id` int(11) NOT NULL,
  `tematica` varchar(120) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eje_seleccionado`
--

CREATE TABLE `eje_seleccionado` (
  `id` int(11) NOT NULL,
  `id_rendicion` int(11) DEFAULT NULL,
  `id_eje` int(11) DEFAULT NULL,
  `cantidad_pregunta` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_admin`
--

CREATE TABLE `historial_admin` (
  `id` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL,
  `accion` enum('habilitar','deshabilitar','crear','editar_password') NOT NULL,
  `motivo` text DEFAULT NULL,
  `realizado_por` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `historial_admin`
--

INSERT INTO `historial_admin` (`id`, `id_admin`, `accion`, `motivo`, `realizado_por`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'crear', NULL, 1, '2025-11-18 02:50:22', '2025-11-18 02:50:22', NULL),
(2, 1, 'crear', NULL, 1, '2025-11-18 02:54:47', '2025-11-18 02:54:47', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_eje` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_seleccionada`
--

CREATE TABLE `pregunta_seleccionada` (
  `id` int(11) NOT NULL,
  `id_eje_seleccionado` int(11) DEFAULT NULL,
  `id_pregunta` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rendicion`
--

CREATE TABLE `rendicion` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `banner` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `rendicion`
--

INSERT INTO `rendicion` (`id`, `fecha`, `hora`, `banner`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2025-11-17', '14:30:00', '1763434222_3e7da763d00759c28b58.jpeg', '2025-11-18 02:50:22', '2025-11-18 02:50:22', NULL),
(2, '2025-12-20', '17:30:00', '1763434487_0769223b10ba126ea478.jpeg', '2025-11-18 02:54:47', '2025-11-18 02:54:47', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `tipo_participacion` enum('asistente','orador') NOT NULL,
  `titulo` enum('PERSONAL','ORGANIZACION') DEFAULT NULL,
  `ruc_empresa` varchar(11) DEFAULT NULL,
  `nombre_empresa` varchar(100) DEFAULT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `id_rendicion` int(11) DEFAULT NULL,
  `asistencia` enum('si','no') NOT NULL DEFAULT 'no',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `baner_rendicion`
--
ALTER TABLE `baner_rendicion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_br_rendicion` (`id_rendicion`);

--
-- Indices de la tabla `eje`
--
ALTER TABLE `eje`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eje_seleccionado`
--
ALTER TABLE `eje_seleccionado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_es_rendicion` (`id_rendicion`),
  ADD KEY `fk_es_eje` (`id_eje`);

--
-- Indices de la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ha_admin` (`id_admin`),
  ADD KEY `fk_ha_realizado` (`realizado_por`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_p_usuario` (`id_usuario`),
  ADD KEY `fk_p_eje` (`id_eje`);

--
-- Indices de la tabla `pregunta_seleccionada`
--
ALTER TABLE `pregunta_seleccionada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ps_es` (`id_eje_seleccionado`),
  ADD KEY `fk_ps_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `rendicion`
--
ALTER TABLE `rendicion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_r` (`id_rendicion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `baner_rendicion`
--
ALTER TABLE `baner_rendicion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `eje`
--
ALTER TABLE `eje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eje_seleccionado`
--
ALTER TABLE `eje_seleccionado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pregunta_seleccionada`
--
ALTER TABLE `pregunta_seleccionada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rendicion`
--
ALTER TABLE `rendicion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `baner_rendicion`
--
ALTER TABLE `baner_rendicion`
  ADD CONSTRAINT `fk_br_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `eje_seleccionado`
--
ALTER TABLE `eje_seleccionado`
  ADD CONSTRAINT `fk_es_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_es_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  ADD CONSTRAINT `fk_ha_admin` FOREIGN KEY (`id_admin`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ha_realizado` FOREIGN KEY (`realizado_por`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `fk_p_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_p_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta_seleccionada`
--
ALTER TABLE `pregunta_seleccionada`
  ADD CONSTRAINT `fk_ps_es` FOREIGN KEY (`id_eje_seleccionado`) REFERENCES `eje_seleccionado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ps_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_r` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
