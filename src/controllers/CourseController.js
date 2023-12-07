/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API para gerenciamento de cursos
 */

const User = require('../models/User');
const Course = require('../models/Course');

/**
 * @swagger
 * /users/{user_id}/courses:
 *   get:
 *     summary: Lista todos os cursos de um usuário
 *     description: Retorna uma lista de todos os cursos de um usuário.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Uma lista de cursos.
 *         content:
 *           application/json:
 *             example:
 *               courses: [{ id: 1, name: 'Programming' }, { id: 2, name: 'Math' }]
 *       '401':
 *         description: Não autorizado.
 */
const index = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
      include: { association: 'courses', through: { attributes: ['user_id'] } },
    });

    if (!user) {
      return res.status(400).send({
        status: 0,
        message: 'Usuário não encontrado!',
      });
    }

    return res.status(200).send(user.courses);
  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * @swagger
 * /users/{user_id}/courses:
 *   post:
 *     summary: Adiciona um curso a um usuário
 *     description: Adiciona um curso a um usuário existente.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'New Course'
 *     responses:
 *       '200':
 *         description: Curso adicionado com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const store = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({
        status: 0,
        message: 'Usuário não encontrado!',
      });
    }

    const [course] = await Course.findOrCreate({
      where: { name },
    });

    await user.addCourse(course);

    return res.status(200).json({
      status: 1,
      message: 'Curso adicionado com sucesso!',
      course,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, error: 'Erro ao adicionar curso' });
  }
};

/**
 * @swagger
 * /users/{user_id}/courses:
 *   delete:
 *     summary: Remove um curso de um usuário
 *     description: Remove um curso de um usuário existente.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'Course to be removed'
 *     responses:
 *       '200':
 *         description: Curso removido com sucesso.
 *       '400':
 *         description: Requisição inválida.
 *       '401':
 *         description: Não autorizado.
 */
const deleteCourse = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({
        status: 0,
        message: 'Usuário não encontrado!',
      });
    }

    const course = await Course.findOrCreate({
      where: { name },
    });

    await user.removeCourse(course);

    return res.status(200).json({
      status: 1,
      message: 'Relacionamento deletado com sucesso!',
    });
  } catch (error) {
    return res.status(400).json({ status: 0, error: 'Erro ao remover curso' });
  }
};

module.exports = {
  index,
  store,
  deleteCourse,
};
