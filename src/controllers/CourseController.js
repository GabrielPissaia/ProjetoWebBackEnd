const User = require('../models/User');
const Course = require('../models/Course');

module.exports = {

     /**
     * @swagger
     * tags:
     *   name: UserCourse
     *   description: Endpoints relacionados a cursos de usuários
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Course:
     *       type: object
     *       required:
     *         - name
     *       properties:
     *         name:
     *           type: string
     *           description: Nome do curso
     *       example:
     *         name: Curso1
     */

    /**
     * @swagger
     * /users/{user_id}/courses:
     *   get:
     *     summary: Retorna a lista de cursos de um usuário
     *     tags: [UserCourse]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         description: ID do usuário
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Course'
     *       400:
     *         description: Usuário não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Usuário não encontrado!
     */

    async index(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: { association: 'courses', through: { attributes: [ 'user_id'] } }
        });

        if (!user) {
            return res.status(400).send({
                status: 0,
                message: 'Curso não encontrado!'
            });
        }

        return res.status(200).send(user.courses);
    },

    /**
     * @swagger
     * /users/{user_id}/courses:
     *   post:
     *     summary: Cadastra um novo curso para um usuário
     *     tags: [UserCourse]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         description: ID do usuário
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Dados do curso a ser cadastrado
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Course'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Course'
     *       400:
     *         description: Usuário não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Usuário não encontrado!
     */

    async store(req, res) {

      try {

          const { user_id } = req.params;
          const { name } = req.body;

          const user = await User.findByPk(user_id);

          if (!user) {
              return res.status(400).json({
                  status: 0,
                  message: 'Usuário não encontrado!'
              });
          }

          const [ course ] = await Course.findOrCreate({
            where: { name }
          });

          await user.addCourse(course);

          return res.status(200).json({
              status: 1,
              message: "Curso cadastrado com sucesso!",
              course
          });

        } catch (err) {
          return res.status(400).json({ error: err });
      }
    },

     /**
     * @swagger
     * /users/{user_id}/courses:
     *   delete:
     *     summary: Deleta o relacionamento entre um usuário e um curso
     *     tags: [UserCourse]
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         description: ID do usuário
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Dados do curso a ser removido
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Course'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             example:
     *               status: 1
     *               message: Relacionamento deletado com sucesso!
     *       400:
     *         description: Usuário não encontrado
     *         content:
     *           application/json:
     *             example:
     *               status: 0
     *               message: Usuário não encontrado!
     */
    
    async delete(req, res) {
        try {

          const { user_id } = req.params;
          const { name } = req.body;

          const user = await User.findByPk(user_id);

          if (!user) {
              return res.status(400).json({
                  status: 0,
                  message: 'Usuário não encontrado!'
              });
          }

          const course = await Course.findOrCreate({
            where: { name }
          });

          await user.removeCourse(course);

          return res.status(200).json({
              status: 1,
              message: "Relacionamento deletado com sucesso!"
          });

        } catch (err) {
          return res.status(400).json({ error: err });
      }
    }
};