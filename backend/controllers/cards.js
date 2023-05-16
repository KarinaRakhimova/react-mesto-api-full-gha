const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Card = require('../models/card');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};
// создаёт карточку
async function createCard(req, res, next) {
  const { name, link } = req.body;
  const newCard = await Card.create({ name, link, owner: req.user._id });
  Card.findById(newCard._id)
    .populate('owner')
    .then((card) => res.status(201).send(card))
    .catch(next);
}
// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .populate('owner')
    .then((card) => {
      const owner = card.owner._id.toString();
      if (owner !== req.user._id) {
        throw new ForbiddenError('Доступ запрещен');
      } return card.deleteOne({ _id: req.params.cardId });
    })
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
